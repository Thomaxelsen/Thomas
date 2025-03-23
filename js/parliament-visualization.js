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
    
    // Set up dimensions
    const width = 600;
    const height = 350;
    const radius = Math.min(width, height * 1.8) / 2;
    
    // Create SVG container
    const svg = d3.select("#d3-parliament")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height})`);
    
    visualizationData.svg = svg;
    
    // Sort parties by political position (left to right)
    const sortedParties = [...parties].sort((a, b) => a.position - b.position);
    
    // Create array of all seats with fixed positions
    visualizationData.allSeats = [];
    
    // Calculate positions for each seat in a hemicycle
    const seatRadius = 7;
    const rows = 9;
    
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
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(TOTAL_SEATS / (rows * 1.5)));
        } else if (row < 6) {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(TOTAL_SEATS / rows));
        } else {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(TOTAL_SEATS / (rows * 0.7)));
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
    if (seatPositions.length > TOTAL_SEATS) {
        seatPositions = seatPositions.slice(0, TOTAL_SEATS);
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
    
    // Render all seats
    renderSeats(selectedParties);
}

// Render all seats based on current selection
function renderSeats(selectedParties) {
    if (!visualizationData.svg) return;
    
    // Remove existing seats
    visualizationData.svg.selectAll(".seat").remove();
    
    const seatRadius = 7;
    
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
                    .attr("font-size", "12px")
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

// This will be called to update the visualization when selection changes
function updateD3Visualization(selectedParties) {
    // Simply re-render all seats with new selection
    renderSeats(selectedParties);
}
