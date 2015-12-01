var L = require('leaflet');
var polyline = require('polyline');

L.Icon.Default.imagePath = 'node_module/leaflet/dist/images/';

var lineOptions = {
    color: 'red',
    weight: 3,
    opacity: .7,
    lineJoin: 'round'
};
var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';

var encodedPolylines = require('./activities.js');
var polylines = encodedPolylines.map(function (string) {
    return polyline.decode(string);
});
var lines = L.multiPolyline(polylines, lineOptions);
var bounds = lines.getBounds();

var map = L.map('map');
map.fitBounds(bounds);
var layer = L.tileLayer(tiles, {maxZoom: 18});
layer.addTo(map);
lines.addTo(map);
