var express = require('express');
var strava = require('./lib/strava');

var port = 3000;

var app = express();

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

app.get('/activity/:id', function(req, res) {
    strava.retrieveActivityStream(req.params.id, function(err, data) {
        res.send(data);
    });
});

app.listen(port, function() {
    console.log('Listening on port: ' + port);
});

