var async = require('async'),
  request = require('request'),
  u = require('underscore');

var regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([^\?#&"'>]+)/;
module.exports.regex = regex;


var getApi = function(id, callback){
  request({
    url: 'https://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json',
    json: true
  }, function(err, res, body){
    callback(err, body);
  });
};

var getOembed = function(id, callback){
  request({
    url: 'http://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id),
    json: true
  }, function(err, res, body){
    callback(err, body);
  });
};


var fromId = function(id, callback){
  if (id){
    async.parallel({
      api: function(cb){
        getApi(id, cb);
      },
      oembed: function(cb){
        getOembed(id, cb);
      }
    }, function(err, resp){
      var json = u.extend({}, resp.oembed, {
        description: resp.api.entry.media$group.media$description.$t
      });
      callback(err, json);
    });
  }
  return null;
};

module.exports.fromUrl = function(url, callback){
  var match = url.match(regex);
  if (match){
    return fromId(match[1], callback);
  }
  return null;
};
