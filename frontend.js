var L = require('leaflet');
var $ = require('jquery');
var Plotter = require('./lib/plotter');
var DateChangeControl = require('./lib/DateChangeControl');

//var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
var tiles = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var layer = L.tileLayer(tiles, {maxZoom: 18});
var map = L.map('map').setView([51.505, -0.09], 13);
layer.addTo(map);

var plotter = new Plotter(map);


L.Icon.Default.imagePath = 'node_module/leaflet/dist/images/';

var dateChange = new DateChangeControl();

dateChange.updateMap = function(after, before, typeSelect) {
    plotter.plotBetween(after, before, typeSelect);
};

dateChange.addTo(map);
