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

