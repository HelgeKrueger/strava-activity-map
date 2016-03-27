var strava = require('strava-v3');
var polyline = require('polyline');

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

    return function(callback) {
        strava.athlete.listActivities({'after': afterSeconds, 'before': beforeSeconds, 'per_page': 200, 'page': page}, function (err, data) {
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

module.exports = {
    getActivitiesIdsBetweenDates: getActivitiesIdsBetweenDates,
    retrieveActivityStream: retrieveActivityStream,
    getSummaryPolylines: getSummaryPolylines
};
