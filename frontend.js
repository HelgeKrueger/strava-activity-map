var L = require('leaflet');
var $ = require('jquery');
var plotter = require('./plotter');

L.Icon.Default.imagePath = 'node_module/leaflet/dist/images/';

//var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
var tiles = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var layer = L.tileLayer(tiles, {maxZoom: 18});
var map = L.map('map').setView([51.505, -0.09], 13);
layer.addTo(map);

plotter.plotBetween(map, '2016-01-01', '2016-12-31');
