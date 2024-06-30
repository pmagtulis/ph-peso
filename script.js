; (function () {
    const margin = { top: 20, right: 30, bottom: 20, left: 30 }

    const width = 1000 - margin.left - margin.right,
        height = 480 - margin.top - margin.bottom;

    let pesoLine; // create a variable in the outermost scope where we can store the lines we draw
    let label;
    var dataMin= 48;
    var dataMax= 60;


    const svg = d3
        .select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style('fill', 'white')

    // const colorScale = d3.scaleOrdinal().range(d3.schemeDark2)
    const xPositionScale = d3.scaleTime().range([0, width])
    const yPositionScale = d3.scaleLinear().range([0, height])
    const parseDate = d3.timeParse("%Y-%m-%d")



    const line = d3
        .line()
        .x(d => xPositionScale(d.date))
        .y(d => yPositionScale(d.close))

    d3.csv("data/closing.csv")
        .then(ready)
        .catch(function (error) {
            console.log("Failed with", error)
        })

    function ready(datapoints) {
        console.log("ready")
        datapoints.forEach(function (d) {
            d.date = parseDate(d.date)
            d.close = +d.close;
        })

        // Update the scales
        yPositionScale.domain([dataMin, dataMax]).nice()
        xPositionScale.domain(d3.extent(datapoints, d => d.date))


        pesoLine = svg.append("path")
            .datum(datapoints)
            .attr('stroke', '#d72514')
            .attr('stroke-width', 3)
            .attr("fill", "none")
            .attr("d", line)
            .style('stroke-dasharray', 7000) // hiding the lines sneakily
            .style('stroke-dashoffset', 7000);



        const yAxis = d3.axisLeft(yPositionScale)
            .tickSize(0, 0) // size of ticks
            .tickPadding([5])
            .ticks(6)
        svg.append("g")
            .attr("class", "axis y-axis")
            .style('stroke-width', 2) // increase stroke width of axis
            .style('font-size', '14px')
            .style('font-family', 'Roboto')
            .call(yAxis)
        
        svg.append("g")
            .attr("class", "y-gridlines")
            .call(d3.axisLeft(yPositionScale)
                .tickSize(-width) // Set the size of the gridlines (-width to cover the entire width of the chart)
                .tickFormat("")
            );

            d3.select(".y-gridlines")
            .selectAll(".tick line")
            .style("stroke", "#ccccc") // Color of the gridlines

            d3.select(".y-axis")
            .selectAll(".domain")
            .remove();



        const xAxis = d3.axisBottom(xPositionScale)
            .tickSize(5, 0) // size of ticks
            .tickPadding([5]);
        svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + height + ")")
            .style('stroke-width', 2) // increase stroke width of axis
            .style('font-size', '14px')
            .style('font-family', 'Roboto')
            .call(xAxis)

            d3.select(".x-axis")
            .selectAll(".domain")
            .remove();

        // dot = svg.append('circle') // assigning my label to the variable up top
        //     .attr('cx', xPositionScale(parseDate("2024-5-24")))
        //     .attr('cy', yPositionScale("58.13"))
        //     .attr("r", 3)
        //     .style("fill", "#d72514")
        //     .attr('class', 'label hidden');

        // do stuff to the chart here
        // depending on what step you are at
        const updateChart = (step_index, direction) => {

            console.log('we are at step', step_index);

            if (step_index === 0) {
                //animating my lines into view
                if (direction === 'forward') {
                    d3.select("path")
                        .transition()
                        .duration(9000)
                        .style('stroke-dashoffset', 1);

                } else {
                    pesoLine
                        .style('opacity', 0).style('stroke-width', 1)
                        .transition()
                        .duration(9000)
                        .style('stroke-dashoffset', 1);
                }

            }



            // if(step_index === 4){
            //     if(direction==='forward'){
            //         // lines.style('opacity', 1).style('stroke-width', 1);
            //         dot.classed('hidden', false);
            //     } else{
            //         dot.classed('hidden', true);
            //     }
            // }

            if (step_index === 4) {
                if (direction === 'forward') {
                    // lines.style('opacity', 1).style('stroke-width', 1);
                    label.classed('hidden', false);
                } else {
                    label.classed('hidden', true);
                }
            }



        };

        //select the steps
        let steps = d3.select('.yr-container').selectAll('.step');
        // add a listener to the steps that knows when it enters into view
        // using enter-view.js (https://github.com/russellgoldenberg/enter-view)
        // call the update function when we switch to a new step!

        enterView({
            selector: steps.nodes(), // which elements to pay attention to
            offset: 0.2, // the offset says when on the page should the trigger happen. 0.5 == when the top of the element reaches the middle of the page
            enter: el => { // when it enters, do this
                const index = +d3.select(el).attr('data-index'); //get the "data-index" attribute
                updateChart(index, 'forward'); // run the updateChart function, pass it the 'data-index"
            },
            exit: el => { // when it leaves view (aka scrolling backwards), do this
                let index = +d3.select(el).attr('data-index'); // get the index
                index = Math.max(0, index - 1); // subtract one but don't go lower than 0
                updateChart(index, 'back'); // update with the new index
            }
        });

    }
})()