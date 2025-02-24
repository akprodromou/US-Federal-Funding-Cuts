// Load Data
d3.csv("../data/departments_funding.csv").then(fundingData => {
    d3.json("../data/word_counts_by_department.json").then(wordData => {

        const offset = 220;
        const treemapHeight = 900;
        const treemapWidth = 600;
        const totalHeight = treemapHeight + offset;
        const totalWidth = treemapWidth + offset;
        const paddingOuter = 5;
          
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
            .size([treemapWidth, treemapHeight])
            .paddingOuter(5)
            .paddingInner(0); 

        treemap(root);

        const svg = d3.select("svg")
            .attr("width", totalWidth)
            .attr("height", totalHeight);

        const nodes = svg.selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("transform", d => `translate(${d.x0 + offset/2},${d.y0 + offset})`);

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

        svg.append("text")
        .text("US Federal Funding Freeze")
        .attr("class","title")
        .attr("text-anchor", "start") 
        .attr("x",offset/2 + 2.5) // Set horizontal position
        .attr("y", 45) // Set vertical position
        .attr("fill", "black");

        // Append description below the title
        svg.append("foreignObject")
        .attr("width", treemapWidth) 
        .attr("height", 200) 
        .attr("x", offset/2 + paddingOuter) // Set horizontal position
        .attr("y", 65)
        .attr("class","description")
        .append("xhtml:div")
        .style("text-align", "left") 
        .style("color", "black")
        .html(`
        On January 27, 2025, the US Office of Management and Budget (OMB) issued a memorandum directing federal<br>
        agencies to temporarily pause activities related to the obligation or disbursement of federal financial assistance<br>
        in targeted areas such as foreign aid, diversity, equity, and inclusion (DEI) initiatives, and environmental projects.<br>
        <span style="display: block; margin-top: 5px;"></span>
        The OMB identified approximately 2,600 federal programs for review under this directive. While the freeze affects<br>
        a significant number of programs, it does not encompass all federal programs, but approximately 20-30% of them. The total freeze is estimated at over $6.375 trillion .<br>
        <span style="display: block; margin-top: 5px;"></span>
        This visualization shifts the focus from individual programs to thematic funding distribution within each department, highlighting key themes/topics (words) that receive funding across multiple programs.<br>
        `);
       
    });
});

