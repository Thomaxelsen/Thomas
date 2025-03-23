// Parliament visualization using D3.js

// This function will be called from the main script
function createD3ParliamentVisualization(parties, selectedParties) {
    // Clear any existing visualization
    d3.select("#d3-parliament").html("");
    
    // Set up dimensions - gjør SVG litt større for bedre visning
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
    
    // Sort parties by political position (left to right)
    const sortedParties = [...parties].sort((a, b) => a.position - b.position);
    
    // Create array of all seats
    let allSeats = [];
    sortedParties.forEach(party => {
        for (let i = 0; i < party.seats; i++) {
            allSeats.push({
                party: party.shorthand,
                color: party.color,
                name: party.name,
                selected: selectedParties.includes(party.shorthand)
            });
        }
    });
    
    // Calculate positions for each seat in a hemicycle
    const seatRadius = 7;  // Litt større seter
    
    // We'll create a hemicycle with multiple rows
    const rows = 9;  // En ekstra rad for bedre fordeling
    
    // Create row arcs
    for (let row = 0; row < rows; row++) {
        // Calculate radius for this row (outer rows have larger radius)
        const rowRadius = radius * 0.35 + (radius * 0.6 * (row / rows));
        
        // Calculate how many seats can fit in this row - justerer for bedre fordeling
        const circumference = Math.PI * rowRadius;
        const maxSeatInRow = Math.floor(circumference / (seatRadius * 2.2));
        
        // Justerer fordelingen av seter per rad
        let seatsInRow;
        if (row < 3) {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(allSeats.length / (rows * 1.5)));
        } else if (row < 6) {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(allSeats.length / rows));
        } else {
            seatsInRow = Math.min(maxSeatInRow, Math.ceil(allSeats.length / (rows * 0.7)));
        }
        
        // Get seats for this row
        const rowSeats = allSeats.splice(0, seatsInRow);
        if (rowSeats.length === 0) break;
        
        // Calculate angle between seats
        const angleStep = Math.PI / (rowSeats.length - 1 || 1);  // Unngå divisjon med null
        
        // Create seats in this row
        rowSeats.forEach((seat, i) => {
            // Spread seats more evenly
            const angle = Math.PI - (angleStep * i);
            const x = rowRadius * Math.cos(angle);
            const y = rowRadius * Math.sin(angle) * -1;
            
            // Create seat circle
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", seatRadius)
                .attr("fill", seat.color)
                .attr("class", seat.selected ? "seat active" : "seat")
                .attr("data-party", seat.party)
                .attr("stroke", "#fff")
                .attr("stroke-width", 0.5)
                .style("opacity", seat.selected ? 1 : 0.3)
                .style("cursor", "pointer")  // Viser at setene er interaktive
                .on("mouseover", function() {
                    d3.select(this).attr("r", seatRadius * 1.3);
                    
                    // Show tooltip
                    svg.append("text")
                        .attr("id", "tooltip")
                        .attr("x", x)
                        .attr("y", y - 15)
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
}

// This will be called to update the visualization when selection changes
function updateD3Visualization(selectedParties) {
    d3.selectAll(".seat")
        .each(function() {
            const seat = d3.select(this);
            const party = seat.attr("data-party");
            
            if (selectedParties.includes(party)) {
                seat.classed("active", true)
                    .style("opacity", 1);
            } else {
                seat.classed("active", false)
                    .style("opacity", 0.3);
            }
        });
}
