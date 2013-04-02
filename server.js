var express = require('express'),
  oembed = require('./lib/oembed');

var app = express();


app.get('/v1.json', function(req, res){
  oembed.fromUrl(req.query.url, function(err, json){
    if (err){
      res.json(404, {
        status: 404,
        message: err
      });
    } else {
      res.json(json);
    }
  });
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
