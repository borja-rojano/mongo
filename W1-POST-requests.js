"use strict";

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    express = require('express'),
    engines= require('consolidate'),
    bodyParser = require('body-parser'),
    app =express();

app.engine('html', engines.nunjucks); //We register the nunjucks template engine to be associated with html extensions.
app.set('view engine', 'html');       //Here we set the views engine of express to the 'html' engine we defined above.
app.set('views', __dirname+'/views'); //Where our templates are located.

// Setting body parser before router for using in the POST requests.

app.use(bodyParser.json() );                       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   // to support URL-encoded bodies


// Launching the app

mongo.connect('mongodb://localhost:27017/video', function (err, db) {
    assert.equal(null, err);

    console.log('Connected to DB');

    app.get('/', function (req, res) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('index', {'movies': docs})
        });
    });

    app.post('/newMovie', function (req, res) {
        console.log(req.body);
        var id = req.body.id;
        res.send(`Searching for the movie with id: ${id}`);

    });

    app.use(function (req,res) {
        res.send('There is nothing here');
    });

    var server = app.listen(3000, function () {
        console.log("Server listening on port 3000\n");
    });
    
});





