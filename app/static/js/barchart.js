function get_info_on_var(variable) {
    var rel_meta = meta_data.find(function (d) {
        return d.Variabele == variable;
    })

    var label = rel_meta['Label_1'];
    var definition = rel_meta['Definition'];

    return [label, definition]
}




var width = 700;
var height = 700;
var MOUSEOVER = false;

var svgPieContainer = d3.select("#piechart").append("svg")
    .attr("height", height)
    .attr("width", width);

var pieData = d3.map(data[0]).entries();

var pies = d3.pie().sort(null).startAngle(-90 * 360).endAngle(90 * 360).value(d => d.value)(pieData);

var svg = svgPieContainer, radius = Math.min(width, height) / 2, g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']);

svg.append("g")
    .attr("class", "labels");
svg.append("g")
    .attr("class", "lines");

// Generate the arcs
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

//Generate groups
var arcs = g.selectAll("arc")
    .data(pies)
    .enter()
    .append("g")
    .attr("class", "arc")

//Draw arc paths
arcs.append("path")
    .attr("fill", function (d, i) {
        return color(i);
    }).transition().duration(500).attrTween("d", interp);

function interp(a) {
    var i = d3.interpolate({ startAngle: -90 * 360, endAngle: -90 * 360 }, a);
    return function (t) {
        return arc(i(t));
    };
}

arcs
    .on("mouseover", function (d, i) {
        var x_var = d.data.key;
        var value = d.value;
        var info = get_info_on_var(x_var);
        var label = info[0]
        var definition = info[1];

        displayTooltip("<b>Data: </b>" + d.data.key + "<br /><b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
            value + "%<br /><b>Explanation: </b>" + definition)
    })
    .on("mousemove", function (d, i) {
        var x_var = d.data.key;
        var value = d.value;
        var info = get_info_on_var(x_var);
        var label = info[0]
        var definition = info[1];

        displayTooltip("<b>Data: </b>" + d.data.key + "<br /><b>Variable: </b>" + label + "<br /><b>Percentage: </b>" +
            value + "%<br /><b>Explanation: </b>" + definition)
    })
    .on("mouseout", function (d) {
        hideTooltip();
    });
