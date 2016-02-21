var strava = require('./lib/strava');
var async = require('async');
var fs = require('fs');

var getActivities = function(idList, callback) {
    async.map(idList, strava.retrieveActivityStream, function(err, results) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            callback(null, results);
        }
    });
};

var outputStreams = function(streams, callback) {
    console.log('Begining to write file');
    fs.writeFileSync('activities.js', 'module.exports=' + JSON.stringify(streams) + ';');
    console.log('Done writing file');
    callback(null);
};

async.waterfall([
    strava.getActivitiesIdsBetweenDates(new Date('2015-11-11'), new Date('2015-12-21')),
    getActivities,
    outputStreams
]);
