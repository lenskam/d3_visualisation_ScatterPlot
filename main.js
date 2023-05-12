const app = "Scatterplot Graph";

// Declare variables
const svgH = 800;
const svgW = 900;
const margin = 40;
const r = 10;
const maxY = svgH - margin*2;
const maxX= svgW - margin*2;

const color = d3.scaleOrdinal(d3.schemeCategory10);
const timeFormat = d3.timeFormat('%M:%S');

// Add elements
const tooltip = d3
  .select('body')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', '0');

const svg = d3
  .select('body')
  .append('svg')
  .attr('height', svgH)
  .attr('width', svgW)
.attr('class', 'svg')
  .append('g')
  .attr('transform', 'translate(' + margin*1.5 + ',' + margin + ')');


// Get data
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
.then(response => response.json())
.then(data => {
  data.forEach(function (d) {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(':');
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
  
  // Set the scales
  const XScale = d3.scaleLinear()
    .domain([
      d3.min(data, function (d) {
        return d.Year - 1;
      }),
      d3.max(data, function (d) {
        return d.Year + 1;
      })
    ])
    .range([0, maxX]);
  const YScale = d3.scaleTime()
    .domain(
      d3.extent(data, function (d) {
        return d.Time;
      })
    )
    .range([0, maxY]);
  
  // Set the axis
  const X = d3
    .axisBottom(XScale).tickFormat(d3.format('d'));
  const Y = d3
    .axisLeft(YScale).tickFormat(timeFormat);
  
  // Append  X axis to svg
  svg.append('g')
  .attr('id', 'x-axis')
  .attr('transform', 'translate('+0+','+maxY+')')
  .call(X);
  
  // Append  X axis to svg
  svg.append('g')
  .attr('id', 'y-axis')
  .attr('transform', 'translate('+0+',0)')
  .call(Y);
  
  svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -160)
      .attr('y', -50)
      .style('font-size', 18)
  .style('font-weight', 'bold')
      .text('Time in Minutes');
  
  svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', r)
      .attr('cx', function (d) {
        return XScale(d.Year);
      })
      .attr('cy', function (d) {
        return YScale(d.Time);
      })
      .attr('data-xvalue', function (d) {
        return d.Year;
      })
      .attr('data-yvalue', function (d) {
        return d.Time.toISOString();
      })
      .style('fill', function (d) {
        return color(d.Doping !== '');
      })
      .on('mouseover', function (event, d) {
        tooltip.style('opacity', 0.9);
        tooltip.attr('data-year', d.Year);
        tooltip
          .html(
            d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              timeFormat(d.Time) +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        tooltip.style('opacity', 0);
      });
  
  const legendContainer = svg.append('g').attr('id', 'legend');

    const legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (maxY / 2 - i * 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', maxX - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', maxX - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });
  
});
  
