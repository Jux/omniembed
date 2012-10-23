var express = require('express'),
  oembed = require('./lib/oembed');

var app = express();


app.get('/', function(req, res){
  oembed.fromUrl(req.query.url, function(err, json){
    if (err){
      res.json(err);
    } else {
      res.json(json);
    }
  });
});


app.listen(3000);
console.log('Listening on port 3000');
