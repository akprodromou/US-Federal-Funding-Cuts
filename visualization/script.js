// Load Data
d3.csv("../departments_funding.csv").then(fundingData => {
    d3.json("../word_counts_by_department.json").then(wordData => {

        const width = 900, height = 1200;
        
        // Convert funding to numeric 
        fundingData.forEach(d => {
            d.Funding = +d.funding || 1; // Ensure funding is numeric
        });

        // Convert Data into Hierarchy for Treemap
        const root = d3.hierarchy({ children: fundingData })
            .sum(d => d.Funding)
            .sort((a, b) => b.value - a.value);

        // Create Treemap Layout
        const treemap = d3.treemap()
            .size([width, height])
            .paddingOuter(5)
            .paddingInner(0); 

        treemap(root);

        const svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

        const nodes = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0},${d.y0})`);

        // Draw Treemap Rectangles
        nodes.append("rect")
            .attr("class", "treemap-block")
            .attr("width", d => d.x1 - d.x0)
            .attr("height", d => d.y1 - d.y0)            
            .attr('stroke', "black")
            .attr('stroke-width', 5)
            .attr("fill", "black");
            // .attr("fill", (d, i) => d3.schemeSet3[i % 10]);

        // Add Department Labels (Centered)
        // nodes.append("text")
        //     .attr("class", "treemap-label")
        //     .attr("x", d => (d.x1 - d.x0) / 2)
        //     .attr("y", d => 20) // Move up to make space for words
        //     .attr("text-anchor", "middle")
        //     .attr("dominant-baseline", "middle")
        //     .style("fill", "white")
        //     .style("font-size", d => Math.min((d.x1 - d.x0) / 10, 14) + "px")
        //     .style("pointer-events", "none")
        //     .text(d => d.data.department);

        // Add Word Clouds Inside Each Treemap Block
        nodes.each(function (d, i) {
            const departmentName = d.data.department;
            const departmentWords = wordData[d.data.department];
            // Combine d3.schemeSet3 and d3.schemeSet2 to create 16 unique colors
            const extendedColorScheme = [...d3.schemeSet3, ...d3.schemeSet2.slice(0, 4)];

            // Assign a color to each department
            const color = extendedColorScheme[i % 16];

            // Print department name and its assigned color in the console
            console.log(`Department: ${departmentName}, Color: ${color}`);

            if (departmentWords && Object.keys(departmentWords).length > 0) {
                createWordCloud(d3.select(this), departmentWords, d.x1 - d.x0, d.y1 - d.y0, color);
            }
        });

        function createWordCloud(container, wordsData, width, height, color) {
            // Convert JSON object to array
            const words = Object.entries(wordsData)
                .map(([word, count]) => ({ text: word, size: count }));

            if (words.length === 0) return;

            const layout = d3.layout.cloud()
                .size([width, height])
                .words(words)
                .padding(3)
                .rotate(() => Math.random() > 0.5 ? 0 : 90) // Alternate between horizontal & vertical
                .fontSize(d => d.size**(6/10) * 6 ) // Scale dynamically
                .on("end", draw);

            layout.start();

            function draw(words) {
                container.append("g")
                    .attr("transform", `translate(${width / 2},${height / 2})`)
                    .selectAll("text")
                    .data(words)
                    .enter().append("text")
                    .attr("class", "treemap-text")
                    .attr("text-anchor", "middle")
                    .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
                    .style("fill", color) // Use the assigned color for all words
                    .style("font-size", d => `${d.size}px`)
                    .text(d => d.text);
            }
        }
       
    });
});

// Create a download button
const downloadButton = d3.select("body")
    .append("button")
    .text("Download Treemap as PNG")
    .style("display", "block")
    .style("margin", "10px")
    .on("click", downloadTreemap);

// Function to export the SVG treemap as PNG
function downloadTreemap() {
    const svg = document.querySelector("svg"); // Select the SVG
    const serializer = new XMLSerializer();
    
    // Get the font CSS
    const fontName = "DM Sans";  
    const fontCSS = getFontCSS(fontName);

    if (!fontCSS) {
        console.error(`Font "${fontName}" not found.  Make sure it's loaded.`);
        alert(`Font "${fontName}" not found.  Export might not work correctly.`);
        return; 
    }

    const svgStyle = `
        <style>
            ${fontCSS}  /* Embed the font CSS */
            text, .treemap-label, .treemap-text {
                font-family: "${fontName}", serif; 
                font-weight: 300 !important;
            }
        </style>`;
    
    // Insert the style inside the SVG
    const svgClone = svg.cloneNode(true);
    const styleElement = document.createElement("style");
    styleElement.innerHTML = svgStyle;
    svgClone.insertBefore(styleElement, svgClone.firstChild);

    // Serialize the modified SVG
    const svgString = serializer.serializeToString(svgClone);
    
    // Create a canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    img.onload = function () {
        // Set canvas size to match SVG
        canvas.width = svg.clientWidth;
        canvas.height = svg.clientHeight;

        // Draw the SVG onto the canvas
        ctx.drawImage(img, 0, 0);

        // Create a PNG from canvas and download
        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "treemap.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Cleanup
        URL.revokeObjectURL(url);
    };

    img.src = url;
}

// Helper function to get the font CSS 
function getFontCSS(fontName) {
    // Check if the font is already loaded
    const fontFaceSet = document.fonts;
    const font = Array.from(fontFaceSet).find(f => f.family === fontName);

    if (font) {
      return `@font-face {
        font-family: '${fontName}';
        src: ${font.src};
        font-style: ${font.style};
        font-weight: ${font.weight};
        unicode-range: ${font.unicodeRange};
        font-stretch: ${font.stretch};
      }`;
    } else {
        console.warn(`Font ${fontName} not found. Ensure it's loaded correctly.`);
        return null;
    }
}