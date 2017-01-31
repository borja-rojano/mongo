"use strict";

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    express = require('express'),
    app =express();



// Launching the app

mongo.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

    assert.equal(null, err);

    console.log('Connected to DB');


    const query = {category_code: 'biotech'};

    db.collection('companies').find(query).toArray(function (err, docs) {

        assert.equal(err, null);
        assert.notEqual(docs.length, 0);
        docs.forEach(function (doc) {
            console.log(`${doc.name} was founded in `);
        }); 
        db.close();
    });
});





