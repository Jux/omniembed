var async = require('async'),
  request = require('request'),
  u = require('underscore');

var regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([^\?#&"'>]+)/;
module.exports.regex = regex;


var getMediaUrl = function(id){
  // no need to use https
  return 'http://www.youtube.com/watch?v=' + id;
};


var getApi = function(id, callback){
  request({
    url: 'http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json',
    json: true
  }, function(err, res, body){
    callback(err, body);
  });
};

var getMarkup = function(id, callback){
  request({
    url: getMediaUrl(id)
  }, function(err, res, body){
    callback(err, body);
  });
};

var getOembed = function(id, callback){
  request({
    url: 'http://www.youtube.com/oembed?url=' + encodeURIComponent(getMediaUrl(id)),
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
      markup: function(cb){
        getMarkup(id, cb);
      },
      oembed: function(cb){
        getOembed(id, cb);
      }
    }, function(err, resp){
      // note that we are assuming a certain order of attributes here... TODO handle them switched
      var pattern = /<[^>]+"og:(video:(?:width|height))"[^>]+content="([^"]*)"[^>]*>/g,
        match, width, height;

      while ( match = pattern.exec( resp.markup ) ) {
        switch ( match[1] ) {
          case 'video:width':
            width = parseInt( match[2], 10 );
            break;
          case 'video:height':
            height = parseInt( match[2], 10 );
        }
      }

      var json = u.extend({}, resp.oembed, {
        description: resp.api.entry.media$group.media$description.$t,
        width: width,
        height: height
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
