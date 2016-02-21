var assert = require('assert');
var strava = require('../lib/strava');


describe('Strava utility functions', function() {
    it('can retrieve an activity from 2016 from strava', function(done) {
        var after = new Date('2016-01-01');
        var before = new Date('2016-12-31');
        var retrieveFunction = strava.getActivitiesIdsBetweenDates(after, before);

        retrieveFunction(function(err, data) {
            if (err) {
                throw err;
            }
            assert(data[0], '1 id was retrieved');

            strava.retrieveActivityStream(data[0], function(err, data) {
                if (err) {
                    throw err;
                }
                assert(data.length > 100, 'first activity contains more than 100 data points');
                assert.equal(data[0].length, 2, 'data points are of the form [lat, lng]');
                done();
            });
        });

    });
});
