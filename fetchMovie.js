"use strict";
var http = require('http');

module.exports.fetchMovie = function(body, callback){

    const name = body.name;

    let options ={
        hostname : 'www.omdbapi.com'
    };

    if (name){

        //We need the words in the name to be in word1+word2 format for the imdb api call
        let  parsedName = body.name.split(' ');
        let apiName = parsedName[0];

        //If there is more than one word we need to add it with a '+' preceding it.

        for (var i = 1; i < parsedName.length; i++) {
            apiName += `+${parsedName[i]}`;

        };
        options.path = `/?t=${apiName}`;
    };

    let req = http.get(options, function(res){
        let received = '';
        
        res.on('data', function(chunk){
            received += chunk;
        });
        
        res.on('end', function () {
            var movie = JSON.parse(received)
            callback(null, movie);
        });
    });

    req.on('error',function (error) {
       callback(error, null);
    });

};