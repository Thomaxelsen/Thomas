 <script>
        // Party data with colors and shorthand, sorted by political position (left to right)
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
    fetch('./data/parties.json')
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

        // Required votes for majority
        const TOTAL_SEATS = 169;
        const MAJORITY_THRESHOLD = 85;

        // DOM elements
        const partyGrid = document.getElementById('partyGrid');
        const progressBar = document.getElementById('progressBar');
        const votesForLabel = document.getElementById('votesFor');
        const votesAgainstLabel = document.getElementById('votesAgainst');
        const totalVotesFor = document.getElementById('totalVotesFor');
        const totalVotesAgainst = document.getElementById('totalVotesAgainst');
        const majorityStatus = document.getElementById('majorityStatus');
        const selectedPartyTags = document.getElementById('selectedPartyTags');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const parliamentSeats = document.getElementById('parliamentSeats');
        const parliamentLegend = document.getElementById('parliamentLegend');

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

      // Toggle party selection
function toggleParty(partyCard) {
    partyCard.classList.toggle('selected');
    updateResults();
    updateVisualization();
}

        // Select all parties
        selectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.party-card').forEach(card => {
                card.classList.add('selected');
            });
            updateResults();
            updateVisualization();
        });

        // Clear all selections
        clearAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.party-card').forEach(card => {
                card.classList.remove('selected');
            });
            updateResults();
            updateVisualization();
        });

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
                    const tag = document.createElement('span');
                    tag.className = `party-tag party-tag-${party.dataset.classPrefix}`;
                    tag.textContent = `${party.dataset.shorthand} (${party.dataset.seats})`;
                    selectedPartyTags.appendChild(tag);
                });
            }
        }

        // Create parliament visualization
        function createParliamentVisualization() {
            // Clear previous seats
            parliamentSeats.innerHTML = '';
            
            // Sort parties from left to right based on political position
            const sortedParties = [...parties].sort((a, b) => a.position - b.position);
            
            // Total seats counter to verify
            let totalCreatedSeats = 0;
            
            // Create a hemicycle visualization with multiple rows
            const rowCount = 8; // Number of rows in the parliament
            const rows = [];
            
            // Initialize empty rows
            for (let i = 0; i < rowCount; i++) {
                const row = document.createElement('div');
                row.className = 'parliament-row';
                // Make the rows curve by adjusting width - outer rows are wider
                const rowWidth = 50 + Math.sin(Math.PI * (i / (rowCount - 1))) * 45;
                row.style.width = `${rowWidth}%`;
                rows.push(row);
                parliamentSeats.appendChild(row);
            }
            
            // Simplified approach: Divide the rows into left-to-right "columns"
            // For each party, get their proportional number of seats
            // Create party blocks in each row
            
            // We'll distribute parties from left to right in each row
            
            // Calculate number of "slots" per row
            // Each party will get a number of slots proportional to its size
            const slotsPerRow = [];
            for (let i = 0; i < rowCount; i++) {
                // Calculate based on row width
                const rowWidth = 50 + Math.sin(Math.PI * (i / (rowCount - 1))) * 45;
                const slots = Math.floor(TOTAL_SEATS * (rowWidth / 95) / rowCount * 1.2);
                slotsPerRow.push(slots);
            }
            
            // Calculate total number of slots
            const totalSlots = slotsPerRow.reduce((a, b) => a + b, 0);
            
            // Calculate seats per party per row - must sum to their actual seats
            const partyRowAllocation = {};
            
            // Initialize allocation
            sortedParties.forEach(party => {
                partyRowAllocation[party.shorthand] = Array(rowCount).fill(0);
            });
            
            // Allocate seats for each party
            sortedParties.forEach(party => {
                let seatsRemaining = party.seats;
                
                // Calculate ideal distribution across rows
                const idealSeatsPerRow = rows.map((_, rowIndex) => {
                    const proportion = slotsPerRow[rowIndex] / totalSlots;
                    return Math.round(party.seats * proportion);
                });
                
                // Adjust to ensure totals match
                for (let rowIndex = 0; rowIndex < rowCount && seatsRemaining > 0; rowIndex++) {
                    const idealSeats = idealSeatsPerRow[rowIndex];
                    partyRowAllocation[party.shorthand][rowIndex] = Math.min(idealSeats, seatsRemaining);
                    seatsRemaining -= partyRowAllocation[party.shorthand][rowIndex];
                }
                
                // If we still have seats to assign, add them to rows from the front
                for (let rowIndex = rowCount - 1; rowIndex >= 0 && seatsRemaining > 0; rowIndex--) {
                    partyRowAllocation[party.shorthand][rowIndex]++;
                    seatsRemaining--;
                }
            });
            
            // Verify each party has the correct number of seats allocated
            sortedParties.forEach(party => {
                const totalAllocated = partyRowAllocation[party.shorthand].reduce((a, b) => a + b, 0);
                if (totalAllocated !== party.seats) {
                    console.error(`Party ${party.name} allocated ${totalAllocated} seats, expected ${party.seats}`);
                }
            });
            
            // Create seats for each row
            let seatIndex = 0;
            
            for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                const row = rows[rowIndex];
                
                // Process each party in order from left to right
                for (let partyIndex = 0; partyIndex < sortedParties.length; partyIndex++) {
                    const party = sortedParties[partyIndex];
                    const seatsForPartyInRow = partyRowAllocation[party.shorthand][rowIndex];
                    
                    // Add seats for this party in this row
                    for (let i = 0; i < seatsForPartyInRow; i++) {
                        const seat = document.createElement('div');
                        seat.className = 'seat';
                        seat.style.backgroundColor = party.color;
                        seat.dataset.party = party.shorthand;
                        seat.dataset.index = seatIndex++;
                        row.appendChild(seat);
                        totalCreatedSeats++;
                    }
                }
            }
            
            console.log(`Created ${totalCreatedSeats} total seats, expected ${TOTAL_SEATS}`);
            
            // Create legend
            parliamentLegend.innerHTML = '';
            sortedParties.forEach(party => {
                const legendItem = document.createElement('div');
                legendItem.className = 'legend-item';
                
                const legendColor = document.createElement('div');
                legendColor.className = 'legend-color';
                legendColor.style.backgroundColor = party.color;
                
                const legendText = document.createElement('span');
                legendText.textContent = `${party.name} (${party.seats})`;
                
                legendItem.appendChild(legendColor);
                legendItem.appendChild(legendText);
                parliamentLegend.appendChild(legendItem);
            });
            
            // Validate seat counts
            const seatCounts = {};
            document.querySelectorAll('.seat').forEach(seat => {
                const party = seat.dataset.party;
                seatCounts[party] = (seatCounts[party] || 0) + 1;
            });
            
            sortedParties.forEach(party => {
                const count = seatCounts[party.shorthand] || 0;
                if (count !== party.seats) {
                    console.error(`Party ${party.name} has ${count} seats in visualization, expected ${party.seats}`);
                }
            });
        }

        // Update visualization based on party selection
        function updateVisualization() {
            const selectedParties = Array.from(document.querySelectorAll('.party-card.selected'));
            const selectedPartyShorthands = selectedParties.map(party => party.dataset.shorthand);
            
            // Update seat styling
            document.querySelectorAll('.seat').forEach(seat => {
                if (selectedPartyShorthands.includes(seat.dataset.party)) {
                    seat.classList.add('active');
                } else {
                    seat.classList.remove('active');
                }
            });
        }

 
    </script>
