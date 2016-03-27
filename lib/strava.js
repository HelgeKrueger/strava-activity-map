var strava = require('strava-v3');
var polyline = require('polyline');
var async = require('async');

var getActivitiesIdsBetweenDates = function(after, before) {
    var afterSeconds = after.getTime() / 1000;
    var beforeSeconds = before.getTime() / 1000;

    return function(callback) {
        strava.athlete.listActivities({'after': afterSeconds, 'before': beforeSeconds, 'per_page': 200}, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var ids = data.filter(function(row) {
                    return row.type === 'Ride';
                }).map(function(row) {
                    return row.id;
                });
                console.log('Got activity ids ' + JSON.stringify(ids));
                callback(null, ids);
            }
        });
    };
};
var retrieveActivityStream = function(activityId, callback) {
    strava.streams.activity({'id': activityId, 'types': ['latlng']}, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log('Retrieved stream for ' + activityId);
            if (!data) {
                console.log('got no data');
                callback(null, []);
            }
            callback(null, data[0].data);
        }
    });
};

var getSummaryPolylines = function(after, before, page) {
    var afterSeconds = after.getTime() / 1000;
    var beforeSeconds = before.getTime() / 1000;

    var options = {
        'after': afterSeconds,
        'before': beforeSeconds,
        'per_page': 200,
        'page': page
    };

    return function(callback) {
        strava.athlete.listActivities(options, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var polylines = data.filter(function(row) {
                    return row.type === 'Ride';
                }).map(function(row) {
                    return polyline.decode(row.map.summary_polyline);
                });
                console.log('Retrieved ' + polylines.length + ' polylines');
                callback(null, polylines);
            }
        });
    };
};

var getSummaryForPage = function(after, before, page) {
    var afterSeconds = after.getTime() / 1000;
    var beforeSeconds = before.getTime() / 1000;

    var options = {
        'after': afterSeconds,
        'before': beforeSeconds,
        'per_page': 200,
        'page': page
    };

    return function(callback) {
        strava.athlete.listActivities(options, function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var summary = data.map(function(row) {
                    return {
                        'type': row.type,
                        'polyline': row.map.summary_polyline ? polyline.decode(row.map.summary_polyline) : []
                    };
                });
                console.log('Retrieved ' + summary.length + ' activities from Strava');
                callback(null, summary);
            }
        });
    };
};

var getAllSummary = function(after, before) {
    var activities = [];
    var numRetrieved = 0;
    var page = 0;
    return function(finalCallback) {
        async.doWhilst(function(callback) {
            var retrieveFunction = getSummaryForPage(after, before, page);
            retrieveFunction(function(err, data) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    activities = activities.concat(data);
                    numRetrieved = data.length;
                    page++;
                    callback(null, data);
                }
            });
        }, function() {
            return numRetrieved === 200;
        }, function() {
            finalCallback(null, activities);
        });
    };
}

module.exports = {
    getActivitiesIdsBetweenDates: getActivitiesIdsBetweenDates,
    retrieveActivityStream: retrieveActivityStream,
    getSummaryPolylines: getSummaryPolylines,
    getAllSummary: getAllSummary
};
