#Notes About Express

### Getting Parameters from a GET request


```app.get('/:name'function (req, res, next) {
    var name = req.params.name;
    var myVar = req.query.myVar;
})```

