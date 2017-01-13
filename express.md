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


 
 The actual request would look like this when we want to get a variable `foo` to sent to our url `bar` with a `post` method. 
 
 ```javascript

    app.post('/bar', function(req, res) {
      var foo = request.body.foo;
    });

```

 #### How POST requests are called in an html form
 Following the example from above, we have the following form that will work with the express route above.
 
 ```html
        
<form action="/bar" method="post">
    <input type="text" value="foo">
</form>

```


