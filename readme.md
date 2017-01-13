# MongoDB Notes

### Basic CRUD
We need to select the db we want to use with `Use <db_name>`.

#### Inserting Documents
`db.myCollection.insert({object})` will add `object` to `myCollection`.
If `myCollection` does not exist it will be created.

#### Finding Items 
To find items in a collection `db.myCollection.find()`.
If left empty, it will list all the objects in the collection.
You can specify conditions that will be `and`. 
`db.myCollection.find({'name':'Borja', 'age':39})`
The query above will print all records with the name `Borja` *and* with an age of `39`.

#### Cursors
Remember that what you get from this query is just a cursor to the first of the documents matching the query.



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




