var L = require('leaflet');
var $ = require('jquery');
var async = require('async');

L.Icon.Default.imagePath = 'node_module/leaflet/dist/images/';

var lineOptions = {
    color: 'red',
    weight: 3,
    opacity: 0.7,
    lineJoin: 'round'
};
//var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
var tiles = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var layer = L.tileLayer(tiles, {maxZoom: 18});
var map = L.map('map').setView([51.505, -0.09], 13);
layer.addTo(map);

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


$.getJSON('activities', function(idList) {
    console.log('number of activities: ' + idList.length);
    async.mapSeries(idList, getActivity, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log('Done plotting');
        }
    });
});
