var express = require('express'),
  cors = require('cors'),
  oembed = require('./oembed');

var app = express();

app.use(express.logger());
app.use(express.compress());

app.get('/v1.json', cors(), function(req, res){
  oembed.fromUrl(req.query.url, function(err, json){
    var status;
    if (err){
      // TODO use status from underlying request?
      status = 502;
      if (err.status){
        json = err;
      } else {
        json = {
          status: status,
          message: err
        };
      }
    } else {
      status = 200;
    }

    var callback = req.query.callback;
    if (callback){
      res.jsonp(status, json);
    } else {
      res.json(status, json);
    }
  });
});


module.exports = app;
