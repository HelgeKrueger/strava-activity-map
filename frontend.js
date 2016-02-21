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
var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
var layer = L.tileLayer(tiles, {maxZoom: 18});
var map = L.map('map').setView([51.505, -0.09], 13);
layer.addTo(map);

var getActivity = function(activityId, callback) {
    $.getJSON('activity/' + activityId, function(track) {
        callback(null, track);
    });
};

$.getJSON('activities', function(idList) {
    async.map(idList, getActivity, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            var lines = L.multiPolyline(results, lineOptions);
            var bounds = lines.getBounds();
            map.fitBounds(bounds);
            lines.addTo(map);
        }
    });
});
