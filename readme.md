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

#### Example of complete search queries

*Find a movie from the year 2013 that is rated PG-13 and won no awards*

`db.movieDetails.find({year:2013, awards.wins:0, rated:'PG-13'},{'title':1, year:1, rated:1, awards:1}).pretty()`

See we are using a projection in `find({query},{projection})` to get smaller, more readable output instead of the whole JSONs


*Using the video.movieDetails collection, how many movies list "Sweden" second in the the list of countries.*

`db.movieDetails.find({'countries.1':'Sweden'}).count()`

Notice the `array.1` notation in the search query.


*How many documents in the video.movieDetails collection list both "Comedy" and "Crim*

`db.movieDetails.find({genres:{$all:['Comedy', 'Crime']}}).count()`



## Updating documents

Updating is an extension of finding, since we need to find the document or documents we want to update.

`updateOne({search query})` will simply update the first document that results from the search query.

You need to specify an update operator:

`db.movieDetails.find({title: 'The Martian'}, {$set: {"poster" : "http://ia.media-imdb.com/images/M/MV5BMTc2MTQ3MDA1Nl5BMl5BanBnXkFtZTgwODA3OTI4NjE@._V1_SX300.jpg"}})`

There are incremental operators, for example to add review numbers to a movie. For example, this query adds 10 reviews and raises the rating of a movie:

`db.movieDetails.updateOne({title:'The Martian'}, {$inc:{"tomato.reviews" : 10, "tomato.rating": 0.2}})`

### Updating Arrays

See the [documentation for updating arrays](https://docs.mongodb.com/manual/reference/operator/update-array/#array-update-operators).

For example, adding several reviews to the martian:

```db.movieDetails.updateOne({title:'The Martian'},
        {$push { reviews:
            { $each: [{}, {}, ...,{}]}
}})

```
If we don't use the `$each` modifier we would be adding the whole array in one go. 

If we wanted to keep the amount of reviews limited to 5, there is a functionality for that. Notice the use of `$slice` below.

```db.movieDetails.updateOne({title:'The Martian'},
        {$push { reviews:
            { $each: [{}, {}, ...,{}], $position: 0,  $slice: 5 
}}})

```

The query above pushes each of the reviews to the beginning of the array and the other reviews after 5 are removed.

### Upserting

we can make a query so that if the document to be updated does not exist, it will be created. This is useful when creating a collection, to avoid duplicates.

In the case of movies, when adding a `detail` object:

```javascript

db.movieDetails.updateOne(
    {imdb.id: detail.imdb.id},  // Find an eventual duplicate
    {$set: detail},             // Update it
    {upsert: true}              // If it does not exist, create it.
);

```





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





