var assert = require('assert'),
  image_size = require('../lib/image_size');

describe('image_size', function(){
  var url = 'http://i2.ytimg.com/vi/AF9QWgO5mU0/maxresdefault.jpg?feature=og';

  it("should fetch correct dimensions for " + url, function(done){
    image_size(url, function(err, dimensions){
      if (!err){
        assert.strictEqual(dimensions.width, 1050);
        assert.strictEqual(dimensions.height, 576);
      }
      done(err);
    });
  });
});
