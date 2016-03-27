var L = require('leaflet');
var $ = require('jquery');
var async = require('async');

var lineOptions = {
    color: 'red',
    weight: 3,
    opacity: 0.7,
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
    var url = 'polylines?' + $.param(params);

    $.getJSON(url, function(polylines) {
        addTracksToMap(polylines, map);
    });
};

module.exports = {
    plotBetween: plotBetween,
};
