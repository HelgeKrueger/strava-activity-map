var express = require('express');
var strava = require('./lib/strava');

var port = 3000;

var app = express();

app.disable('etag');
app.use(express.static('static'));

app.get('/activities', function(req, res) {
    var after = new Date('2016-01-01');
    var before = new Date('2016-12-31');
    var retrieveFunction = strava.getActivitiesIdsBetweenDates(after, before);

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

