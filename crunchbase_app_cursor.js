"use strict";

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),
    express = require('express'),
    app =express();



// Launching the app

mongo.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

    assert.equal(null, err);

    console.log('Connected to DB\n********');


    const query = {category_code: 'biotech'};

    const cursor = db.collection('companies').find(query);

    cursor.forEach(function (doc) {
            console.log(doc.name);
    },
    function (err) {
        assert.equal(null, err);
        return db.close();
    }
    );

});





