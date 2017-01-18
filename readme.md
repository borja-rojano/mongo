# MongoDB Notes
[See notes about express.js](https://github.com/borja-rojano/mongo/blob/master/express.md)

## CRUD
We need to select the db we want to use with `Use <db_name>`.

## Inserting Documents
`db.myCollection.insert({object})` will add `object` to `myCollection`.
If `myCollection` does not exist it will be created.

#### Insert many documents
Mongo can insert many documents when passed an array of documents with
`db.myCollection.insertMany([{},{},...,{}]);`

With the command above, mongo will insert documents in the order they are passed in the array. 
If `document[n]` has an error, the insertion will be done for all documents up to `[n-1]` and then it will stop.

We can pass an options object to the `insertMany` command:

```javascript
    
    db.myCollection.insertMany(
        [
            {},
            {},
            ...,
            {}
        ],
        {"ordered": false}    
        );
    
```
With the `{"ordered": false} ` option, mongo will keep inserting documents after it finds an error.


## Finding Documents 
To find items in a collection `db.myCollection.find()`.
If left empty, it will list all the objects in the collection.
You can specify conditions that will be `and`. 
`db.myCollection.find({'name':'Borja', 'age':39})`
The query above will print all records with the name `Borja` *and* with an age of `39`.

To show a nice parsed view of the documents found use `find().pretty()`.

#### Counting documents
To get a count of the documents found, instead of the cursor(see below), you can  run `db.myCollection.find({'name':'Borja', 'age':39}).count()`. 

#### Cursors
Remember that what you get from this query is just a cursor to the first of the documents matching the query.

#### Finding documents with conditions including nested documents.
We can use the dot syntax for finding documents with a condition that includes an entry in a nested document.
For example, if we have a `{"user": {"name":"Borja", ....}, ....}` where the `name` property is in a `user` field we can run:

`db.myCollection.find({'user.name':'Borja', 'age':39}).count()`

#### Equality matches in arrays
When we have a document structure where one key `actors` has an array of values `'actors': ['Van Damme', ...,'Bruce Lee'] ` we can run a normal query like 

`db.myCollection.find({'actors':'Bruce Lee'})` and it will find all documents which lists at least `Bruce Lee` as an actor. 

Bear in mind that using array notation will only find *exact ordered matches*. For example `db.myCollection.find({'actors':['Van Damme', 'Bruce Lee'])` would not find a document with both actors where Bruce is listed before jean-Claud.

#### Specific position in an array
If we want to find only the movies where Bruce Lee is listed in the first position of the array we can use the dot notation with the index of the position that we are interested in.

`db.myCollection.find({'actors.0':'Bruce Lee'})`

### Projections
To reduce the size of the data we get from the database we can use projections. It limits the fields that are returned from the found documents. 

Projections are passed as the second argument to the `find` command.

`db.myCollection.find({'actors':'Bruce Lee'}, {'Title':1})`

When we pass the projection, only the fields explicitly activated will be returned, with the exception of the `_id` field that is always returned unless we set it to 0.

If we pass only fields with a value of 0, we are getting the full document minus those explicitly excluded fields.

### Query Selectors
[See the docs about query selectors](https://docs.mongodb.com/manual/reference/operator/query/#query-selectors)

We can use an object in the value of a given field to use query selectors. for example:

`db.myCollection.find({'runtime': {$gt:90} }, {'Title':1})`

This will find all movies with a runtime greater than 90 minutes and return only their name. 

We can combine them:

`db.myCollection.find({'runtime': {$gt:90, $lt:120} }, {'Title':1})`

The query above returns movies between 90 and 120 minutes.


## Updating documents



## Database Management

### Extracting Data From a Dump
First you need to have the MongoDb server running, with `mongod`.
Open another terminal.
Navigate to the folder containing the `dump` folder and run.
Then you can run `mongo` and activate the mongo shell. 
`show dbs` in the mongo shell will show you all databases.

### Deleting a Database
`drop` is the command to delete a database. 
First we need to `use myDB`.

Then we run `db.dropDatabase()`.





