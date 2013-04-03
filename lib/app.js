var express = require('express'),
  oembed = require('./oembed');

var app = express();

app.use(express.logger());
app.use(express.compress());

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


module.exports = app;
