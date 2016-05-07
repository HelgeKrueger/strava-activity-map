var L = require('leaflet');
var $ = require('jquery');
var _ = require('underscore');
var async = require('async');

var Plotter = function(map) {
    this.lines = null;
    this.lineOptions = {
        color: 'blue',
        weight: 3,
        opacity: 0.3,
        lineJoin: 'round'
    };
    this.map = map;
};

Plotter.prototype.addTracksToMap = function(tracks) {
    if (this.lines) {
        this.map.removeLayer(this.lines);
    }
    this.lines = L.featureGroup(tracks.map(row => {
        var track = L.polyline(row.polyline, this.lineOptions);
        track.on('click', () => {
            window.open('https://www.strava.com/activities/' + row.id, '_blank').focus();
        });
        return track;
    }));
    var bounds = this.lines.getBounds();
    this.map.fitBounds(bounds);
    this.map.addLayer(this.lines);
};

Plotter.prototype.handleData = function(data) {
    this.addTracksToMap(data);
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
