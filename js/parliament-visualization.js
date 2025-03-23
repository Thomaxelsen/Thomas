// Parliament visualization using D3.js

// Global variable for visualization data
let visualizationData = {
  svg: null,
  allSeats: [],
  partyData: {}
};

// This function will be called from the main script
function createD3ParliamentVisualization(parties, selectedParties) {
    // Clear any existing visualization
    d3.select("#d3-parliament").html("");
    
    // Store party data for later reference
    visualizationData.partyData = {};
    parties.forEach(party => {
        visualizationData.partyData[party.shorthand] = party;
    });
    
    // Set up dimensions - mindre størrelse for å passe i containeren
    const width = 400;  // Redusert fra 600
    const height = 220; // Redusert fra 350
    const radius = Math.min(width, height * 1.8) / 2;
    
    // Create SVG container with responsive scaling
    const svg = d3.select("#d3-parliament")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);
    
    visualizationData.svg = svg;
    
    // Sort parties by political position (left to right)
    const sortedParties = [...parties].sort((a, b) => a.position - b.position);
    
    // Create array of all seats with fixed positions
    visualizationData.allSeats = [];
    
    // Calculate positions for each seat in a hemicycle
    const seatRadius = 5; // Redusert størrelse på setene
    const rows = 8;       // Færre rader
    
    // First, calculate total seats per row and positions without assigning parties
    let seatPositions = [];
    
    for (let row = 0; row < rows; row++) {
        // Calculate radius for this row (outer rows have larger radius)
        const rowRadius = radius * 0.35 + (radius * 0.6 * (row / rows));
        
        // Calculate how many seats can fit in this row
        const circumference = Math.PI * rowRadius;
        const maxSeatInRow = Math.floor(circumference / (seatRadius * 2.2));
        
        // Distribute seats more evenly among rows
        let seatsInRow;
        if (row < 3) {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(169 / (rows * 1.5)));
        } else if (row < 6) {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(169 / rows));
        } else {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(169 / (rows * 0.7)));
        }
        
        // Calculate angle between seats
        const angleStep = Math.PI / (seatsInRow - 1 || 1);
        
        // Create positions for this row
        for (let i = 0; i < seatsInRow; i++) {
            const angle = Math.PI - (angleStep * i);
            const x = rowRadius * Math.cos(angle);
            const y = rowRadius * Math.sin(angle) * -1;
            
            seatPositions.push({
                x: x,
                y: y,
                row: row
            });
        }
    }
    
    // Ensure we don't have more positions than seats
    if (seatPositions.length > 169) {
        seatPositions = seatPositions.slice(0, 169);
    }
    
    // Now assign parties to positions in left-to-right order
    let seatIndex = 0;
    sortedParties.forEach(party => {
        for (let i = 0; i < party.seats; i++) {
            if (seatIndex < seatPositions.length) {
                const position = seatPositions[seatIndex];
                visualizationData.allSeats.push({
                    party: party.shorthand,
                    color: party.color,
                    name: party.name,
                    selected: selectedParties.includes(party.shorthand),
                    x: position.x,
                    y: position.y,
                    row: position.row,
                    index: seatIndex
                });
                seatIndex++;
            }
        }
    });
    
    // Oppdater også legenden med partier
    updateLegend(parties);
    
    // Render all seats
    renderSeats(selectedParties);
}

// Render all seats based on current selection
function renderSeats(selectedParties) {
    if (!visualizationData.svg) return;
    
    // Remove existing seats
    visualizationData.svg.selectAll(".seat").remove();
    
    const seatRadius = 5; // Justert radius
    
    // Create seats
    visualizationData.allSeats.forEach(seat => {
        const isSelected = selectedParties.includes(seat.party);
        
        visualizationData.svg.append("circle")
            .attr("cx", seat.x)
            .attr("cy", seat.y)
            .attr("r", seatRadius)
            .attr("fill", seat.color)
            .attr("class", "seat")
            .attr("id", `seat-${seat.index}`)
            .attr("data-party", seat.party)
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .style("opacity", isSelected ? 1 : 0.3)
            .style("cursor", "pointer")
            .on("mouseover", function() {
                d3.select(this).attr("r", seatRadius * 1.3);
                
                visualizationData.svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", seat.x)
                    .attr("y", seat.y - 15)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "10px")
                    .attr("fill", "#333")
                    .attr("stroke", "#fff")
                    .attr("stroke-width", 0.5)
                    .attr("paint-order", "stroke")
                    .text(seat.name);
            })
            .on("mouseout", function() {
                d3.select(this).attr("r", seatRadius);
                d3.select("#tooltip").remove();
            });
    });
}

// Update the legend with current party data
function updateLegend(parties) {
    // Clear existing legend
    document.getElementById('parliamentLegend').innerHTML = '';
    
    // Create new legend items
    parties.forEach(party => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const legendColor = document.createElement('div');
        legendColor.className = 'legend-color';
        legendColor.style.backgroundColor = party.color;
        
        const legendText = document.createElement('span');
        legendText.textContent = `${party.name} (${party.seats})`;
        
        legendItem.appendChild(legendColor);
        legendItem.appendChild(legendText);
        document.getElementById('parliamentLegend').appendChild(legendItem);
    });
}

// This will be called to update the visualization when selection changes
function updateD3Visualization(selectedParties) {
    // Simply re-render all seats with new selection
    renderSeats(selectedParties);
}
