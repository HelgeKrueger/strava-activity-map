var L = require('leaflet');
var $ = require('jquery');
var plotter = require('./plotter');

var DateChangeControl = L.Control.extend({
    options: { position: 'topright' },
    addInput: function(name, type, value, container) {
        this[name] = L.DomUtil.create('input', name, container);
        this[name].type = type;
        this[name].value = value;
    },
    addTypeSelect: function(container) {
        this.typeSelect = L.DomUtil.create('select', 'type-select', container);
        this.typeSelect.innerHTML = '<option value="">All</option>';
        this.typeSelect.innerHTML += '<option value="Ride">Ride</option>';
        this.typeSelect.innerHTML += '<option value="Run">Run</option>';
    },
    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'date-change');
        this.form = L.DomUtil.create('form', 'form', container);
        this.addInput('after', 'text', '2016-01-01', this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addInput('before', 'text', '2016-12-31', this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addTypeSelect(this.form);
        L.DomUtil.create('br', 'linebreak', this.form);
        this.addInput('input', 'button', 'Fetch Map', this.form);
        L.DomEvent.addListener(this.input, 'click', this.updateMap, this);
        return container;
    },
    updateMap: function(e) {
        plotter.plotBetween(this._map, this.after.value, this.before.value, this.typeSelect.value);
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

