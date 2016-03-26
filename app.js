var express = require('express');
var strava = require('./lib/strava');

var port = 3000;

var app = express();

app.disable('etag');
app.use(express.static('static'));

app.get('/activities', function(req, res) {
    var after = new Date(req.query.after);
    var before = new Date(req.query.before);

    console.log('Requesting activities from ' + after + ' to ' + before);

    var retrieveFunction = strava.getActivitiesIdsBetweenDates(after, before);

    retrieveFunction(function(err, data) {
        if (err) {
            throw err;
        }
        res.send(data);
    });
});

app.get('/polylines', function(req, res) {
    var after = new Date(req.query.after);
    var before = new Date(req.query.before);
    var page = req.query.page;
    if (!page) {
        page = 0;
    }

    console.log('Requesting activities from ' + after + ' to ' + before);

    var retrieveFunction = strava.getSummaryPolylines(after, before, page);

    retrieveFunction(function(err, data) {
        if (err) {
            throw err;
        }
        res.send(data);
    });
});

var memo = {someid: '12'};

app.get('/activity/:id', function(req, res) {
    var activityId = req.params.id;
    if (activityId in memo) {
        console.log('Answering from memory');
        res.send(memo[activityId]);
    } else {
        strava.retrieveActivityStream(req.params.id, function(err, data) {
            memo[activityId] = data;
            res.send(data);
        });
    }
});

app.listen(port, function() {
    console.log('Listening on port: ' + port);
});

