// based on http://bl.ocks.org/dbuezas/9572040

function d3charcount(selector) {
    var parentNode = document.getElementById(selector);
    var svgElement = d3.select('#'+selector)
        .append("svg");
    var svg = svgElement
        .append("g");

    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    var width = parentNode.clientWidth,
        height = parentNode.clientHeight,
        radius = Math.min(width-100, height) / 2;
    var aspectRatio = width/height;

    // attempt at responsive element
    svgElement.attr("width", width);
    svgElement.attr("height", width/aspectRatio);
    svgElement.attr("viewBox", "0 0 "+width+" "+height);
    window.addEventListener('resize', function() {
        width = parentNode.clientWidth;
        height = parentNode.clientWidth/aspectRatio;
        // svgElement.height(height);
        svgElement.attr("width", width);
        svgElement.attr("height", height);
    }); //.trigger("resize");

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.value; });

    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var key = function(d){ return d.data.label; };

    var color = d3.scale.category20()
        .domain(Array.apply(null, {length: 26}).map(function (x,i) {
            return String.fromCharCode(97 + i);
        }));    // all lower case chars

    function randomData (){
        var labels = color.domain();
        return labels.map(function(label){
            return { label: label, value: Math.random() }
        }).filter(function() {
            return Math.random() > .6;
        }).sort(function(a,b) {
            return d3.ascending(a.label, b.label);
        });
    }

    change(randomData());

    function mergeWithFirstEqualZero(first, second){
        var secondSet = d3.set(); second.forEach(function(d) { secondSet.add(d.label); });

        var onlyFirst = first
            .filter(function(d){ return !secondSet.has(d.label) })
            .map(function(d) { return {label: d.label, value: 0}; });
        return d3.merge([ second, onlyFirst ])
            .sort(function(a,b) {
                return d3.ascending(a.label, b.label);
            });
    }

    function change(data) {
        /* expect data of the form
         * [
         *    {label:'a', value:3},
         *    ...
         * ]
         */
        var duration = 800;
        var data0 = svg.select(".slices").selectAll("path.slice")
            .data().map(function(d) { return d.data });
        if (data0.length == 0) data0 = data;
        var was = mergeWithFirstEqualZero(data, data0);
        var is = mergeWithFirstEqualZero(data0, data);

        /* ------- SLICE ARCS -------*/

        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(was), key);

        slice.enter()
            .insert("path")
            .attr("class", "slice")
            .style("fill", function(d) { return color(d.data.label); })
            .each(function(d) {
                this._current = d;
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(is), key);

        slice
            .transition().duration(duration)
            .attrTween("d", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    _this._current = interpolate(t);
                    return arc(_this._current);
                };
            });

        slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice
            .exit().transition().delay(duration).duration(0)
            .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
            .data(pie(was), key);

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .style("opacity", 0)
            .text(function(d) {
                return d.data.label;
            })
            .each(function(d) {
                this._current = d;
            });

        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text = svg.select(".labels").selectAll("text")
            .data(pie(is), key);

        text.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : 1;
            })
            .attrTween("transform", function(d) {
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                var interpolate = d3.interpolate(this._current, d);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });

        text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        text
            .exit().transition().delay(duration)
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(was), key);

        polyline.enter()
            .append("polyline")
            .style("opacity", 0)
            .each(function(d) {
                this._current = d;
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(is), key);

        polyline.transition().duration(duration)
            .style("opacity", function(d) {
                return d.data.value == 0 ? 0 : .5;
            })
            .attrTween("points", function(d){
                this._current = this._current;
                var interpolate = d3.interpolate(this._current, d);
                var _this = this;
                return function(t) {
                    var d2 = interpolate(t);
                    _this._current = d2;
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline
            .exit().transition().delay(duration)
            .remove();
    };


    return change;
}
