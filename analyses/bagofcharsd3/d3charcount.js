/* global d3 */

// based on http://bl.ocks.org/dbuezas/9572040

function d3charcount(selector) {  // eslint-disable-line no-unused-vars
  const svg = d3.select(`#${selector}`);

  svg.append('g').attr('class', 'slices');
  svg.append('g').attr('class', 'labels');
  svg.append('g').attr('class', 'lines');

  let width = svg.node().clientWidth;
  let height = svg.node().clientHeight;
  const radius = Math.min(width - 100, height) / 2;
  const aspectRatio = width / height;

  // attempt at responsive element
  svg.attr('width', width);
  svg.attr('height', width / aspectRatio);
  svg.attr('viewBox', `-${width / 2} -${height / 2} ${width} ${height}`);
  svg.on('resize', () => {
    width = svg.node().clientWidth;
    height = width / aspectRatio;
    svg.attr('width', width);
    svg.attr('height', height);
  });

  const pie = d3.layout.pie()
    .sort(null)
    .value(d => d.value);

  const arc = d3.svg.arc()
    .outerRadius(radius * 0.8)
    .innerRadius(radius * 0.4);

  const outerArc = d3.svg.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  const key = d => d.data.label;

  const color = d3.scale.category20()
    .domain(...'abcdefghijklmnopqrstuvwxyz');

  function randomData() {
    return color.domain()
      .map(label => ({ label, value: Math.random() }))
      .filter(() => Math.random() > 0.6)
      .sort((a, b) => d3.ascending(a.label, b.label));
  }

  function mergeWithFirstEqualZero(first, second) {
    const secondSet = d3.set(second.map(d => d.label));

    const onlyFirst = first
      .filter(d => !secondSet.has(d.label))
      .map(d => ({ label: d.label, value: 0 }));

    return d3.merge([second, onlyFirst])
      .sort((a, b) => d3.ascending(a.label, b.label));
  }

  function change(data) {
    /* expect data of the form
     * [
     *    {label:'a', value:3},
     *    ...
     * ]
     */

    const duration = 800;
    let data0 = svg.select('.slices').selectAll('path.slice')
      .data().map(d => d.data);
    if (data0.length === 0) data0 = data;
    const was = mergeWithFirstEqualZero(data, data0);
    const is = mergeWithFirstEqualZero(data0, data);

    /* ------- SLICE ARCS -------*/

    let slice = svg.select('.slices').selectAll('path.slice')
      .data(pie(was), key);

    slice.enter()
      .insert('path')
      .attr('class', 'slice')
      .style('fill', d => color(d.data.label))
      .each(function assignSliceData(d) { this.current_d = d; });

    slice = svg.select('.slices').selectAll('path.slice')
      .data(pie(is), key);

    slice
      .transition().duration(duration)
      .attrTween('d', function sliceAttrTween(d) {
        const interpolate = d3.interpolate(this.current_d, d);
        return (t) => {
          this.current_d = interpolate(t);
          return arc(this.current_d);
        };
      });

    slice = svg.select('.slices').selectAll('path.slice')
      .data(pie(data), key);

    slice
      .exit().transition().delay(duration).duration(0)
      .remove();

    /* ------- TEXT LABELS -------*/

    let text = svg.select('.labels').selectAll('text')
      .data(pie(was), key);

    text.enter()
      .append('text')
      .attr('dy', '.35em')
      .style('opacity', 0)
      .text(d => d.data.label)
      .each(function assignTextData(d) { this.current_d = d; });

    function midAngle(d) {
      return d.startAngle + ((d.endAngle - d.startAngle) / 2);
    }

    text = svg.select('.labels').selectAll('text')
      .data(pie(is), key);

    text.transition().duration(duration)
      .style('opacity', d => (d.data.value === 0 ? 0 : 1))
      .attrTween('transform', function tweenTextAttr(d) {
        const interpolate = d3.interpolate(this.current_d, d);
        return (t) => {
          const d2 = interpolate(t);
          this.current_d = d2;
          const pos = outerArc.centroid(d2);
          pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        };
      })
      .styleTween('text-anchor', function tweenTextStyle(d) {
        const interpolate = d3.interpolate(this.current_d, d);
        return (t) => {
          const d2 = interpolate(t);
          return midAngle(d2) < Math.PI ? 'start' : 'end';
        };
      });

    text = svg.select('.labels').selectAll('text')
      .data(pie(data), key);

    text
      .exit().transition().delay(duration)
      .remove();

    /* ------- SLICE TO TEXT POLYLINES -------*/

    let polyline = svg.select('.lines').selectAll('polyline')
      .data(pie(was), key);

    polyline.enter()
      .append('polyline')
      .style('opacity', 0)
      .each(function assignPolylineData(d) { this.current_d = d; });

    polyline = svg.select('.lines').selectAll('polyline')
      .data(pie(is), key);

    polyline.transition().duration(duration)
      .style('opacity', d => (d.data.value === 0 ? 0 : 0.5))
      .attrTween('points', function lineAttrTween(d) {
        this.current_d = this.current_d;
        const interpolate = d3.interpolate(this.current_d, d);
        return (t) => {
          const d2 = interpolate(t);
          this.current_d = d2;
          const pos = outerArc.centroid(d2);
          pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), pos];
        };
      });

    polyline = svg.select('.lines').selectAll('polyline')
      .data(pie(data), key);

    polyline
      .exit().transition().delay(duration)
      .remove();
  }

  change(randomData());
  return change;
}
