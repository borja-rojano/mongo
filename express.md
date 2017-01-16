#Notes About Express

## The structure of a mongodb app in express


```javascript

mongo.connect('mongodb://localhost:27017/video', function (err, db) {
    assert.equal(null, err);

    console.log('Connected to DB');

    app.get('/', function (req, res) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('index', {'movies': docs})
        });
    });

    app.use(function (req,res) {
        res.send('There is nothing here');
    });

    var server = app.listen(3000, function () {
        console.log("Server listening on port 3000\n");
    });
    
});

```
We use (or create) the db `video` by launching `mongo.connect()`.

Then, inside our `app.get()` method we can call the collection `movies` and `find()` stuff in it. 



##How to use Nunjucks templates

First we need to register the template.

```javascript

//We register the nunjucks template engine to be associated with html extensions.
app.engine('html', engines.nunjucks);

//Here we set the views engine of express to the 'html' engine we defined above.
app.set('view engine', 'html');

//Where our templates are located.
app.set('views', __dirname+'/views')

```
Then we can use them by placing the templates we want in the `views` folder and with the following syntax:

```javascript

app.get('/', function (req, res) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('index', {'movies': docs})
        });
    });

```

Express will render our `index` template with the variables contained in the `docs` object. 
For example we can do `<h1>{{movies[0].name}}</h1>`.


## Getting Parameters from a GET request
If we have a url `myurl/name?myVar=1` we can do:

```javascript

app.get('/:name'function (req, res, next) {
    var name = req.params.name;
    var myVar = req.query.myVar;
})

```

##Handling POST requests

We handle the POST requests by accessing the variables in `request.body`. Before being able to use `.body` we need to parse the request's body. 

See full info [here](http://stackoverflow.com/questions/5710358/how-to-retrieve-post-query-parameters).

The middleware to parse the body of the requests -necessary for this kind of requests- is:

```javascript
var bodyParse = require(body-parser);

app.use(bodyParser.json() );                       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true}));   // to support URL-encoded bodies

```
 
 The actual request would look like this when we want to get an object `foo` sent to our url `bar` with a `post` method. 
 
 ```javascript

    app.post('/bar', function(req, res) {
      var foo = request.body.foo; // This is an object
    });

```

 #### How POST requests are called in an html form
 Following the example from above, we have the following form that will work with the express route above.
 
 ```html
        
<form action="/bar" method="post">
    <input type="text" value="foo">
</form>

```

##Fetching data from an API
Here is an example on how to get data from the IMDB api:
```javascript

function getMovie (name, callback){

   //Name is a string with a search query, e.g. 'Fight+Club'.
   //IMDB expects a search query with /?t=searchQuery

    let options ={
        hostname : 'www.omdbapi.com',
        path : `/?t=${apiName}`
    };    
   

    let req = http.get(options, function(res){
        let received = '';
        
        //every time there is data, it gets added to received.
        res.on('data', function(chunk){
            received += chunk;                      
        });
        
        //When done, we pass the parsed JSON to the callback of this function. 
        res.on('end', function () {
            var movie = JSON.parse(received) //
            callback(null, movie);
        });
    });
    
    //If there is an error, we pass it to the callback.
    req.on('error',function (error) {
       callback(error, null);
    });
};

```


