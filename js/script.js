// Globale variabler
let parties = [];
const TOTAL_SEATS = 169;
const MAJORITY_THRESHOLD = 85;

// DOM elementer - disse vil bli initialisert når dokumentet er lastet
let partyGrid;
let progressBar;
let votesForLabel;
let votesAgainstLabel;
let totalVotesFor;
let totalVotesAgainst;
let majorityStatus;
let selectedPartyTags;
let selectAllBtn;
let clearAllBtn;
let parliamentSeats;
let parliamentLegend;

// Denne funksjonen kjøres når dokumentet er ferdig lastet
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser DOM-elementer
    partyGrid = document.getElementById('partyGrid');
    progressBar = document.getElementById('progressBar');
    votesForLabel = document.getElementById('votesFor');
    votesAgainstLabel = document.getElementById('votesAgainst');
    totalVotesFor = document.getElementById('totalVotesFor');
    totalVotesAgainst = document.getElementById('totalVotesAgainst');
    majorityStatus = document.getElementById('majorityStatus');
    selectedPartyTags = document.getElementById('selectedPartyTags');
    selectAllBtn = document.getElementById('selectAllBtn');
    clearAllBtn = document.getElementById('clearAllBtn');
    parliamentSeats = document.getElementById('parliamentSeats');
    parliamentLegend = document.getElementById('parliamentLegend');
    
    // Last inn partidata og initialiser kalkulatoren
    fetchPartyData();
    
    // Legg til event listeners
    selectAllBtn.addEventListener('click', selectAllParties);
    clearAllBtn.addEventListener('click', clearAllParties);
});

// Funksjoner for å velge/fjerne alle partier
function selectAllParties() {
    document.querySelectorAll('.party-card').forEach(card => {
        card.classList.add('selected');
    });
    updateResults();
    updateVisualization();
}

function clearAllParties() {
    document.querySelectorAll('.party-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateResults();
    updateVisualization();
}

// Hent partidata fra JSON-filen
function fetchPartyData() {
    fetch('/Thomas/data/parties.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Kunne ikke laste inn partidata');
            }
            return response.json();
        })
        .then(data => {
            parties = data;
            createPartyCards();
            createParliamentVisualization();
            updateResults();
            updateVisualization();
        })
        .catch(error => {
            console.error('Feil ved lasting av partidata:', error);
            // Vis feilmelding til brukeren
            partyGrid.innerHTML = '<p>Kunne ikke laste inn partidata. Vennligst prøv igjen senere.</p>';
        });
}

// Opprett parti-kort
function createPartyCards() {
    parties.forEach(party => {
        const partyCard = document.createElement('div');
        partyCard.className = 'party-card';
        partyCard.dataset.seats = party.seats;
        partyCard.dataset.name = party.name;
        partyCard.dataset.shorthand = party.shorthand;
        partyCard.dataset.classPrefix = party.classPrefix;
        
        const partyIcon = document.createElement('span');
        partyIcon.className = `party-icon icon-${party.classPrefix}`;
        partyIcon.textContent = party.shorthand.charAt(0);
        
        const partyName = document.createElement('span');
        partyName.className = 'party-name';
        partyName.textContent = party.name;
        
        const partySeats = document.createElement('span');
        partySeats.className = 'party-seats';
        partySeats.textContent = party.seats;
        
        partyCard.appendChild(partyIcon);
        partyCard.appendChild(partyName);
        partyCard.appendChild(partySeats);
        
        partyCard.addEventListener('click', () => toggleParty(partyCard));
        
        partyGrid.appendChild(partyCard);
    });
}

// Toggle party selection
function toggleParty(partyCard) {
    partyCard.classList.toggle('selected');
    updateResults();
    updateVisualization();
}

// Update results based on selections
function updateResults() {
    const selectedParties = Array.from(document.querySelectorAll('.party-card.selected'));
    const votesFor = selectedParties.reduce((total, party) => total + parseInt(party.dataset.seats), 0);
    const votesAgainst = TOTAL_SEATS - votesFor;
    const hasMajority = votesFor >= MAJORITY_THRESHOLD;
    
    // Update progress bar
    const percentage = (votesFor / TOTAL_SEATS) * 100;
    progressBar.style.width = `${percentage}%`;
    
    if (hasMajority) {
        progressBar.classList.add('majority');
    } else {
        progressBar.classList.remove('majority');
    }
    
    // Update vote counters
    votesForLabel.textContent = votesFor;
    votesAgainstLabel.textContent = votesAgainst;
    totalVotesFor.textContent = votesFor;
    totalVotesAgainst.textContent = votesAgainst;
    
    // Update majority status
    if (hasMajority) {
        majorityStatus.className = 'result-status has-majority';
        majorityStatus.textContent = `Flertall oppnådd med ${votesFor} stemmer`;
    } else {
        majorityStatus.className = 'result-status no-majority';
        const votesNeeded = MAJORITY_THRESHOLD - votesFor;
        majorityStatus.textContent = `Ingen flertall (trenger ${votesNeeded} flere stemmer)`;
    }
    
    // Update selected party tags
    selectedPartyTags.innerHTML = '';
    if (selectedParties.length === 0) {
        const noPartyTag = document.createElement('span');
        noPartyTag.className = 'party-tag';
        noPartyTag.textContent = 'Ingen partier valgt';
        selectedPartyTags.appendChild(noPartyTag);
    } else {
        selectedParties.forEach(party => {
            const tag = document.createElement
