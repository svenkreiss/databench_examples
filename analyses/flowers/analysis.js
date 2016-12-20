/* global Databench */
/* global d3 */
/* global document */

const databench = new Databench.Connection();
Databench.ui.wire(databench);

const branchAngle = document.getElementById('branch_angle').databenchUI;
branchAngle.valueToSlider = (radians => radians * 57.0);
branchAngle.sliderToValue = (degrees => degrees / 57.0);
branchAngle.formatFn = (value => `${(value * 57.0).toFixed(0)} degrees`);

// define how to draw flowers with d3.js
function Flowers(id) {
  const svg = d3.select(`#${id}`);
  const height = svg.node().clientHeight;
  const width = svg.node().clientWidth;

  return function update(json) {
    const lines = svg.selectAll('.line').data(json, d => d[0]);

    lines.enter()
      .append('svg:line')
      .attr('class', 'line')
      .attr('x1', d => width * d[1])
      .attr('y1', d => height * (1.0 - d[2]))
      .attr('x2', d => width * d[3])
      .attr('y2', d => height * (1.0 - d[4]))
      .style('stroke', d => d3.hsl(100, d[6], d[6]).toString())
      .style('stroke-width', 0.0);

    lines.transition()
      .duration(250)
      .style('stroke-width', d => width * d[5]);

    lines.exit()
      .remove();
  };
}

const flowers = Flowers('canvas');
databench.on({ data: 'lines' }, lines => flowers(lines));

// now connect to backend
databench.connect();
