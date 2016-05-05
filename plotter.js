var L = require('leaflet');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');

var Plotter = function() {
    this.lines = null;
    this.lineOptions = {
        color: 'blue',
        weight: 3,
        opacity: 0.3,
        lineJoin: 'round'
    };
};

Plotter.prototype.setMap = function(map) {
    this.map = map;
};

Plotter.prototype.addTracksToMap = function(tracks) {
    if (this.lines) {
        this.map.removeLayer(lines);
    }
    this.lines = L.multiPolyline(tracks, this.lineOptions);
    var bounds = this.lines.getBounds();
    this.map.fitBounds(bounds);
    this.lines.addTo(this.map);
};

Plotter.prototype.handleData = function(data) {
    this.addTracksToMap(data.map(function(row) {
        return row.polyline;
    }));
};

Plotter.prototype.plotBetween = function(after, before, type) {
    var params = {
        after: after,
        before: before,
        type: type
    };
    var url = 'summary?' + $.param(params);

    $.getJSON(url, _.bind(this.handleData, this));
};

module.exports = Plotter;
