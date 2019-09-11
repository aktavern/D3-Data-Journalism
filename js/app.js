// function to automatically resize the chart

  // create SVG wrapper dimensions determined by width/height of window
  var svgWidth = 960;
  var svgHeight = 500;

  var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
  };

  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;

  // create SVG wrapper
  var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // import data from CSV
  d3.csv("data/data.csv").then(function(censusData) {
    
    // format the data 
    censusData.forEach(function(data) {
      data.id = +data.id;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // create scales 
    var xScale = d3.scaleLinear()
      .domain([0,d3.max(censusData, d => d.healthcare)])
      .range([0, width]);
    
    var yScale = d3.scaleLinear()
      .domain(d3.extent(censusData, d => d.poverty))
      .range([height,0]);

    // create axes 
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // append axes to chartGroup
    chartGroup.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append('g')
      .call(leftAxis);

    // append circles to data points
    chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.healthcare))
      .attr("cy",d => yScale(d.poverty))
      .attr("r","15")
      .attr("fill","red")
      .attr("opacity","0.5");

    // append text to circles
    chartGroup.selectAll()
      .data(censusData)
      .enter()
      .append('text')
      .attr("x", d => xScale(d.healthcare) - 6)
      .attr("y", d => yScale(d.poverty) + 4)
      .attr("fill","white")
      .attr("font-size","10")
      .text(d => d.abbr)

    // create axes labels 
    chartGroup.append("text")
      .attr("transform","rotate(-90)")
      .attr('y', 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class","axisText")
      .text("Lacks Healthcare (%)")
    
    chartGroup.append('text')
      .attr("transform",`translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class","axisText")
      .text("In Poverty (%)")
  });

