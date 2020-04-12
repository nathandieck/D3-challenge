var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(incomeData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    incomeData.forEach(function(data) {
      data.income = +data.income;
      data.smokes = +data.smokes;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(incomeData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([5, d3.max(incomeData, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(incomeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "10")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // https://stackoverflow.com/questions/55988709/how-can-i-add-labels-inside-the-points-in-a-scatterplot
    var circleLabels = chartGroup.selectAll(null).data(incomeData).enter().append("text");

    circleLabels
    .attr("x", function(d) {
        return xLinearScale(d.income);
    })
    .attr("y", function(d) {
        return yLinearScale(d.smokes)+3;
    })
    .text(function(d) {
        return d.abbr;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-8, 0])
      .html(function(d) {
        return (`${d.state}<br>Income: ${d.income}<br>Percentage Smokers: ${d.smokes}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage of Smokers");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income");
  }).catch(function(error) {
    console.log(error);
  });
