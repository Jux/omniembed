var request = require('request');

var regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))([^\?#&"'>]+)/;
module.exports.regex = regex;

var fromId = function(id, callback){
  if (id){
    return request({
      url: 'https://gdata.youtube.com/feeds/api/videos/' + id + '?v=2&alt=json',
      json: true
    }, function(err, res, body){
      callback(err, body);
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
