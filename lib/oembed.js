var fs = require('fs'),
  u = require('underscore');

var services = fs.readdirSync('./lib/services').map(function(file){
  return require('./services/' + file);
});

module.exports.fromUrl = function(url, callback){
  var matchingService = u.find(services, function(service){
    return service.regex.test(url);
  });

  if (matchingService){
    matchingService.fromUrl(url, callback);
  } else {
    callback("Could not find matching service.");
  }
};
