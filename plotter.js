var L = require('leaflet');
var $ = require('jquery');
var async = require('async');

var lineOptions = {
    color: 'red',
    weight: 3,
    opacity: 0.3,
    lineJoin: 'round'
};

var plotBetween = function(map, after, before) {
    var lines = null;

    var addTracksToMap = function(tracks, map) {
        if (lines) {
            map.removeLayer(lines);
        }
        lines = L.multiPolyline(tracks, lineOptions);
        var bounds = lines.getBounds();
        map.fitBounds(bounds);
        lines.addTo(map);
    };

    var params = {after: after, before: before};
    var url = 'summary?' + $.param(params);

    $.getJSON(url, function(data) {
        addTracksToMap(data.map(function(row) {
            return row.polyline;
        }), map);
    });
};

module.exports = {
    plotBetween: plotBetween,
};
