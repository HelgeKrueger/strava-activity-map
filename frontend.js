var L = require('leaflet');
var $ = require('jquery');
var plotter = require('./plotter');

var DateChangeControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'date-change');
        this.form = L.DomUtil.create('form', 'form', container);
        this.after = L.DomUtil.create('input', 'after', this.form);
        this.after.type = 'text';
        this.after.value = '2016-01-01';
        this.linebreak1 = L.DomUtil.create('br', 'linebreak', this.form);
        this.before = L.DomUtil.create('input', 'before', this.form);
        this.before.type = 'text';
        this.before.value = '2016-12-31';
        this.linebreak2 = L.DomUtil.create('br', 'linebreak2', this.form);
        this.input = L.DomUtil.create('input', 'change', this.form);
        this.input.type = 'button';
        this.input.value = 'change';
        L.DomEvent.addListener(this.input, 'click', this.updateMap, this);
        return container;
    },
    updateMap: function(e) {
        plotter.plotBetween(this._map, this.after.value, this.before.value);
    }
});

L.Icon.Default.imagePath = 'node_module/leaflet/dist/images/';

//var tiles = 'http://c.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg';
var tiles = 'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png';
var layer = L.tileLayer(tiles, {maxZoom: 18});
var map = L.map('map').setView([51.505, -0.09], 13);
layer.addTo(map);
var dateChange = new DateChangeControl();
dateChange.addTo(map);

