# The Mongo Driver for node.js

## Cursors in the node.js driver

Consider the following code:

```javascript

"use strict";

var mongo = require('mongodb').MongoClient,
    assert = require('assert'),

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

```
The `toArray()` method consumes the cursor created with the `find()` method and gives us an array of documents we can work with.
It pulls everything into memory. The `toArray()` method actually *executes the call*. 

The alternative way to run this query is to create the cursor object and then call its own `forEach()` method. 

```javascript

mongo.connect('mongodb://localhost:27017/crunchbase', function (err, db) {

    assert.equal(null, err);

    console.log('Connected to DB\n********');


    const query = {category_code: 'biotech'};

    const cursor = db.collection('companies').find(query);

    cursor.forEach(
        function (doc) {
            console.log(doc.name);
        },
        function (err) {
            assert.equal(null, err);
            return db.close();
        }
    );
});

```
With this second way of running the app, there is one call to the database for each `doc` we want to retrieve from the cursor.
`find()` creates the cursor immediately, because it does not actually make a request to the db until we try to use some of the docs that it will provide.

The point of the cursor is to describe our query. Note that the `forEach()` method of the cursor is not the same as the one for the array.

Note as well that the second callback of the `forEach()` method of the cursor is executed if there is an error or when the cursor is exhausted.


When the second script is executed, the `forEach()` starts receiving batches of documents. As soon as one batch is available it can start executing its callbacks.
With the first method, the `forEach()` can be launched only when all the documents in the cursor have been received and transformed into an array.


## Projections

```javascript

const query = {category_code: 'biotech'};

const projection = {name: 1, _id: 0}; 

const cursor = db.collection('companies').find(query);

cursor.project(projection);

```
It is important to notice that the `project()` method does not make a call to the db. Rather, it provides additional detail to the cursor.


## Skip, Limit, Sort

These are methods that can be chained to the cursor object:

Sorting works like the statement below, wherein 1 indicates *ascending* order and -1 *descending* order.

`cursor.sort({founded_year: 1})`

It is also possible to nest sorting criteria, like `year` first and then, within a year, by `employees`. In this case we need to use an array.

`cursor.sort([ ["founded", 1], [employees, -1] ])`

We could pass an object instead of an array but this would not guarantee the ordering of criteria.  

`skip()` and `limit()` are self explanatory. Beware of how skip, limit and sort are ordered in the node.js script.  
 
 