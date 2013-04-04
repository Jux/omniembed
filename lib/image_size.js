var exec = require('child_process').exec;

module.exports = function(url, callback){
  exec('curl ' + url + ' | identify -format "%wx%h" -', function(error, stdout){
    if (error){
      callback(error);
    } else {
      var dimensions = stdout.split('x');
      callback(null, {
        width: parseInt(dimensions[0], 10),
        height: parseInt(dimensions[1], 10)
      });
    }
  });
};
