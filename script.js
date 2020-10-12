 d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
    console.log('information', data);
    const margin = ({top: 20, right: 20, bottom: 20, left: 20})
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const svg = d3.select('.chart').append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let IncomeMin = d3.min(data, d => d.Income);
    let IncomeMax = d3.max(data, d => d.Income);
    let LEMin = d3.min(data, d => d.LifeExpectancy);
    let LEMax = d3.max(data, d => d.LifeExpectancy);
    
    let colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    
    const xScale = d3.scaleLinear()
    .domain([IncomeMin, IncomeMax])
    .range([0, width]);

    const yScale = d3.scaleLinear()
    .domain([LEMin, LEMax])
    .range([height, 0]);

    var tooltip = d3.select('.tooltip')
    .style("background-color", "white")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "black")

    svg.selectAll('g')
      .data(data)
      .enter()
      .append("circle")
        .attr('fill', d=>colorScale(d.Region))
        .attr('stroke', 'black')   
        .attr("cx", data => xScale(data.Income))
        .attr("cy", data => yScale(data.LifeExpectancy))
        .attr("r", function(data){
         if (data.Population < 700000){
            return 3;
          } 
         else if (data.Population > 700000 && data.Population < 10000000 ) {
            return 5;
          }
         else{
           return 8; 
        }
     })
      .on("mouseover", (event, d) => {
        const pos = d3.pointer(event, window)
        d3.select('.tooltip')
          .style("opacity", 1)
          .style("left", (pos[0] + 10 + "px"))
          .style("top", (pos[1] + 10 + "px"))
          .html(`Country:  ${d.Country} Life Expectancy:  ${d.LifeExpectancy} Income:  ${d.Income} Population:  ${d.Population} Region:  ${d.Region}`);
      })

      .on("mouseleave", (event, d) => {
        tooltip.style("opacity", 0)
      });
  
    
    const xAxis = d3.axisBottom(xScale)
      .scale(xScale)
      .ticks(5, 's');
    
    svg.append('g')
      .call(xAxis)
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${height})`)
      
    const yAxis = d3.axisLeft(yScale)
      .scale(yScale)
      .ticks(5, 's')

    svg.append('g')
      .call(yAxis)
      .attr("class", "axis y-axis")
    
    svg.append("text")
    .attr("class", "horizontal")
    .attr('x', 275)
    .attr('y', 250)
    .text("Income");

    svg.append("text")
    .attr("class", "vertical")
    .attr('x', 5)
    .attr('y', -20)
    .text("Life Expectancy")
    
var legendRectSize = 18;                                  
var legendSpacing = 4;  

var legend = svg.selectAll('.legend')                     
    .data(colorScale.domain())                                   
    .enter()                                                
    .append('g')                                            
    .attr('class', 'legend')
    .attr('transform', function(d, i) {                     
      var height = legendRectSize + legendSpacing;          
      var offset =  height * colorScale.domain().length / 2;     
      var horz = -2 * legendRectSize + 260;                       
      var vert = i * height - offset + 150;                       
      return 'translate(' + horz + ',' + vert + ')';        
    });        
legend.append('rect')
  .attr('width', legendRectSize)     
  .attr('height', legendRectSize)           
  .style('fill', colorScale) 
  .style('stroke', colorScale)   
legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d){ return d;});
})
