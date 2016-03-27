var assert = require('assert');
var strava = require('../lib/strava');


describe('Strava utility functions', function() {
    it('can retrieve an activity from 2016 from strava', function(done) {
        this.timeout(10000); // The requests take a LOOOOONG time
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
                assert(data.length > 10, 'first activity contains more than 10 data points');
                assert.equal(data[0].length, 2, 'data points are of the form [lat, lng]');
                done();
            });
        });

    });

    it('can retrieve polylines from 2016 from strava', function(done) {
        this.timeout(10000); // The requests take a LOOOOONG time
        var after = new Date('2016-01-01');
        var before = new Date('2016-12-31');
        var retrieveFunction = strava.getSummaryPolylines(after, before);

        retrieveFunction(function(err, data) {
            if (err) {
                throw err;
            }
            assert(data[0], '1 id was retrieved');
            done();
        });

    });

    it('can retrieve all summaries requires more than 200 activities on strava', function(done) {
        this.timeout(50000); // The requests take a LOOOOONG time
        var after = new Date('2010-01-01');
        var before = new Date('2016-12-31');
        var retrieveFunction = strava.getAllSummary(after, before);

        retrieveFunction(function(err, data) {
            if (err) {
                throw err;
            }
            assert(data.length > 200, 'more than 200 activities were retrieved');
            done();
        });
    });

    it('restricts to rides for summary', function(done) {
        this.timeout(10000); // The requests take a LOOOOONG time
        var after = new Date('2016-01-01');
        var before = new Date('2016-12-31');
        var retrieveFunction = strava.getAllSummary(after, before, 'Ride');

        retrieveFunction(function(err, data) {
            if (err) {
                throw err;
            }
            assert(data.every(function(row) {
                return row.type === 'Ride';
            }), 'only rides retrieved');
            done();
        });
    });
});
