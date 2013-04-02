var async = require('async'),
  request = require('request'),
  u = require('underscore');

var regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([^\?#&"'>]+)/;
module.exports.regex = regex;


var getMediaUrl = function(id){
  // no need to use https
  return 'http://www.youtube.com/watch?v=' + id;
};


// returns video size, retrieved from Open Graph tags on video page HTML
var parseMarkup = function(markup){
  // note that we are assuming a certain order of attributes here... TODO handle them switched
  var pattern = /<[^>]+"og:(video:(?:width|height)|image)"[^>]+content="([^"]*)"[^>]*>/g,
    match, thumbnail, width, height;

  while ( match = pattern.exec( markup ) ) {
    switch ( match[1] ) {
      case 'image':
        thumbnail = match[2];
        break;
      case 'video:width':
        width = parseInt( match[2], 10 );
        break;
      case 'video:height':
        height = parseInt( match[2], 10 );
    }
  }

  var attrs = {
    width: width,
    height: height
  };

  // videos that are at least 720p use a different thumbnail URL (maxresdefault.jpg)
  if (width && height && width >= 1280 && height >= 720){
    attrs.thumbnail_url = thumbnail;
    attrs.thumbnail_width = width;
    attrs.thumbnail_height = height;
  }

  return attrs;
};


var dataFromApi = function(id, callback){
  request({
    url: 'http://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json',
    json: true
  }, function(err, res, data){
    if (err){
      callback(err, data);
    } else {
      callback(null, {
        description: data.entry.media$group.media$description.$t
      });
    }
  });
};

var dataFromMarkup = function(id, callback){
  request({
    url: getMediaUrl(id)
  }, function(err, res, body){
    if (err){
      callback(err, body);
    } else {
      callback(null, parseMarkup(body));
    }
  });
};

var dataFromOembed = function(id, callback){
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
        dataFromApi(id, cb);
      },
      markup: function(cb){
        dataFromMarkup(id, cb);
      },
      oembed: function(cb){
        dataFromOembed(id, cb);
      }
    }, function(err, resp){
      if (err){
        callback(err, resp);
      } else {
        // merge the attributes from the various APIs
        var json = u.extend({}, resp.oembed, resp.markup, resp.api);
        callback(null, json);
      }
    });
  }
};

module.exports.fromUrl = function(url, callback){
  var match = url.match(regex);
  if (match){
    fromId(match[1], callback);
  }
};
