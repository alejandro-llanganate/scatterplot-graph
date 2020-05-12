d3.select('.nombre-proyecto')
  .text("Scatterplot Graph con D3.js")

d3.select('.autor')
  .text("Por Alejandro Llanganate")

d3.select('.main')
  .append('h2')
  .text("Dopaje en carreras profesionales de bicicletas")
  .attr('id', 'title')

// tamaño del SVG
let width = 900, height = 550

// radio de los circulos
const radio = 7

// espacio entre los ejes y el contenido de círculos
const padding = 60

// Creación Legend
let colorDopingArgs = 'rgb(88, 103, 151)', 
    colorNoDopingArgs = 'rgb(243, 184, 22)'

let legend = d3.select('.graph')
.append('div')
.attr('id', 'legend')
.style('margin-left', `${width-width/6}px`)
.style('margin-top', `${height-height/1.5}px`)

const legendLine1 = legend.append('div').attr('id', 'Type1').attr('class', 'Type'), 
      legendLine2 = legend.append('div').attr('id', 'Type2').attr('class', 'Type')

const rectType1 = legendLine1.append('div').attr('class', 'rectType').attr('id', 'rectType1').style('background-color', colorNoDopingArgs),
      rectType2 = legendLine2.append('div').attr('class', 'rectType').attr('id', 'rectType2').style('background-color', colorDopingArgs)

const textType1 = legendLine1.append('text').attr('class', 'textType').attr('id', 'textType1').text('Sin acusaciones de dopaje'),
      textType2 = legendLine2.append('text').attr('class', 'textType').attr('id', 'textType2').text('Ciclistas con acusaciones de dopaje')

// Creación Tooltip
let tooltip = d3.select('.graph')
                .append('div')
                .attr('class', 'tooltip')
                .attr('id', 'tooltip')
                .style('visibility', 'hidden')
                .style('opacity', '0');

tooltip.append('text').attr('id', 'line1')
tooltip.append('text').attr('id', 'line2')
tooltip.append('text').attr('id', 'line3')

// Creación del SVG
const svg = d3.select('.graph')
              .append('svg')
              .attr('width', width + padding)
              .attr('height', height)

// para los círculos de representación
svg.append('text').text("Tiempo en Minutos")
.attr("y", padding-15)
.attr("x", -height/2)
.attr('transform', 'rotate(-90)')
.attr('opacity', '0.6')
.style('font-size', '1.5em')

svg.append('g')
const g = svg.select('g')
.attr("transform", `translate(${30},${10} )`)

// Data
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then( data => data.json())
.then( dataSet => {
    
    const data = dataSet.map( d => [new Date(`2010 01 01 00:${d['Time']}`), d.Year, d]) 
   
    const time = data.map(d => d[0])
    const years = data.map(d => d[1])

    // escalas
    const xScale = d3.scaleTime()
                 .domain([d3.min(data, d => new Date(d[1] - 1)), d3.max(data, d => new Date(d[1]+1))])
                 .range([0, width-padding]);     
    
    const yScale = d3.scaleTime()
                 .domain([d3.min(time), d3.max(time)])
                 .range([0, height - padding]); 
            

    //formato para el texto en los ejes
    const yearsFormat = d3.format('d')
    const timeFormat = d3.timeFormat('%M:%S')

    //Ejes
    const yAxis = d3.axisLeft(yScale)
                    .tickFormat(timeFormat);
    
    g.append('g').call(yAxis)
    .attr('id', 'y-axis')
    .attr("transform", `translate(${padding},0)`)

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(yearsFormat);     

    g.append('g').call(xAxis)
    .attr('id', 'x-axis')
    .attr("transform", `translate(${padding},${height - padding} )`)

    // Representación de puntos
    g.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', (d,i) => d[1])
    .attr('data-yvalue', (d,i) => d[0])
    .attr('r', radio)
    .attr('cx', (d,i) => xScale(d[1]))
    .attr('cy', (d,i) =>  yScale(d[0]))
    .attr("transform", `translate(${padding},0)`)
    .attr('fill', (d,i) => d[2]['Doping'] === "" ? colorNoDopingArgs : colorDopingArgs)
    .on('mouseover', (d, i) =>{

      tooltip.style('opacity', '0.9')
      .style('margin-left', `${xScale(d[1]) + 120}px`)
      .style('margin-top', `${yScale(d[0]) - 20}px`)
      .style('visibility', 'visible')
      .style('opacity', '0.95')
      .attr('data-year', d[1])

      tooltip.select('#line1')
             .text(`${d[2]['Name']}: ${d[2]['Nationality']}`)
      tooltip.select('#line2')
             .text(`Year: ${d[2]['Year']}: Time:${d[2]['Time']}`)
      tooltip.select('#line3')
             .text(`${d[2]['Doping']}`)
    })
    .on("mouseout",
            d => { 
              tooltip
              .style('visibility', 'hidden')
              .style('opacity', '0');
            });

})
