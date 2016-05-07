var assert = require('assert');
require('jsdom-global')();
var sinon = require('sinon');

var Plotter = require('../lib/plotter');


describe('Functions to plot tracks on a map', () => {
    it('Correctly handles the empty dataset', () => {
        var mapStub = {
            fitBounds: sinon.stub(),
            addLayer: sinon.stub()
        };
        var plotter = new Plotter(mapStub);

        plotter.handleData([]);
        
        assert(mapStub.fitBounds.calledOnce, 'fitbounds was called once');
        assert(mapStub.addLayer.calledOnce, 'addLayer was called once');
    });

    it('When called twice removeLayer is called', () => {
        var mapStub = {
            fitBounds: sinon.stub(),
            addLayer: sinon.stub(),
            removeLayer: sinon.stub()
        };
        var plotter = new Plotter(mapStub);

        plotter.handleData([]);
        plotter.handleData([]);
        
        assert.equal(mapStub.fitBounds.callCount, 2, 'fitbounds was called twice');
        assert.equal(mapStub.addLayer.callCount, 2, 'addLayer was called twice');
        assert.equal(mapStub.removeLayer.callCount, 1, 'removeLayer was called once');
    });

    it('correctly handles a single data point', () => {
        var mapStub = {
            fitBounds: sinon.stub(),
            addLayer: sinon.stub(),
            removeLayer: sinon.stub()
        };
        var plotter = new Plotter(mapStub);

        plotter.handleData([{
            polyline: [[12, 13]],
            id: 13,
            type: 'Ride'
        }]);
        
        assert.equal(mapStub.fitBounds.callCount, 1, 'fitbounds was called once');
        assert.equal(mapStub.addLayer.callCount, 1, 'addLayer was called once');
        assert.equal(mapStub.removeLayer.callCount, 0, 'removeLayer was not called');
    });
});
