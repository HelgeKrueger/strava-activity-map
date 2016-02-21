var strava = require('strava-v3');

var getActivitiesIdsBetweenDates = function(after, before) {
    var afterSeconds = after.getTime() / 1000;
    var beforeSeconds = before.getTime() / 1000;

    return function(callback) {
        strava.athlete.listActivities(
                {'after': afterSeconds, 'before': beforeSeconds },
                function (err, data) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                var ids = data.map(function(row) {
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
            callback(null, data[0].data);
        }
    });
};

module.exports = {
    getActivitiesIdsBetweenDates: getActivitiesIdsBetweenDates,
    retrieveActivityStream: retrieveActivityStream
};
