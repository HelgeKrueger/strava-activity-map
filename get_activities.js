var async = require('async');
var strava = require('strava-v3');
var polyline = require('polyline');
var fs = require('fs');

var token = '';
var after = new Date('2015-11-11').getTime() / 1000;
var before = new Date('2015-12-21').getTime() / 1000;

var getActivitiesIds = function(callback) {
    strava.athlete.listActivities({'access_token': token, 'after': after, 'before': before }, function (err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            var ids = data.map(function(row) {
                return row['id'];
            });
            console.log('Got activity ids ' + JSON.stringify(ids));
            callback(null, ids);
        }
    });
};
var retrieveActivityStream = function(activityId, callback) {
    strava.streams.activity({'access_token': token, 'id': activityId, 'types': ['latlng']}, function (err, data) {
        console.log('Retrieved stream for ' + activityId);
        callback(null, polyline.encode(data[0]['data']));
    });
};

var getActivities = function(idList, callback) {
    async.map(idList, retrieveActivityStream, function(err, results) {
        callback(null, results);
    });
};

var outputStreams = function(streams, callback) {
    console.log('Begining to write file');
    fs.writeFileSync('activities.js', 'module.exports=' + JSON.stringify(streams) + ';');
    console.log('Done writing file');
    callback(null);
};

async.waterfall([getActivitiesIds, getActivities, outputStreams]);
