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
    var tracks = [];

    var addTracksToMap = function(tracks, map) {
        var lines = L.multiPolyline(tracks, lineOptions);
        var bounds = lines.getBounds();
        map.fitBounds(bounds);
        lines.addTo(map);
    };

    var getActivity = function(activityId, callback) {
        $.getJSON('activity/' + activityId, function(track) {
            tracks.push(track);
            addTracksToMap(tracks, map);
            console.log('number of plotted tracks: ' + tracks.length);
            callback(null, track);
        });
    };

    var params = {after: after, before: before};
    var url = 'activities?' + $.param(params);

    $.getJSON(url, function(idList) {
        console.log('number of activities: ' + idList.length);
        async.mapSeries(idList, getActivity, function(err, results) {
            if (err) {
                console.log(err);
            } else {
                console.log('Done plotting');
            }
        });
    });
};

module.exports = {
    plotBetween: plotBetween,
};
