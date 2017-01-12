/*
This is how you handle parameters and vars in express.
You can have an url with /myName?myVar=value
*/

app.get('/:name'function (req, res, next) {
    // The colon means 'take this part of the url and store it in the params object of the request.
    //You could capture several parameters in the url descrption like '/:name/:date'.
    var name = req.params.name;
    var myVar = req.query.myVar;
})
