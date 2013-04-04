var fs = require('fs'),
  oembed = require('../lib/oembed'),
  u = require('underscore'),
  assert = require('assert'),
  request = require('request');

describe('Live tests', function(){
  var examples = JSON.parse(fs.readFileSync('test/examples.json'));

  u.each(examples, function(expected, url){
    var name = expected.title || url;
    it('should succeed for "' + name + '"', function(done){
      oembed.fromUrl(url, function(err, result){
        if (err){
          done(err);
        } else {
          assert(!u.isEmpty(result), "should not be empty");

          // check that example data is subset of the response
          u.each(expected, function(expectedVal, key){
            var actualVal = result[key];
            assert.strictEqual(actualVal, expectedVal, key + " should match. Expected: " + expectedVal + ', actual: ' + actualVal);
          });

          // verify thumbnail size
          request({
            url: 'http://magickly.jux.com/analyze/width?src=' + encodeURIComponent(result.thumbnail_url)
          }, function(thumbErr, res, width){
            if (!thumbErr){
              assert.strictEqual(result.thumbnail_width, parseInt(width, 10));
            }

            done(thumbErr);
          });
        }
      });
    });
  });
});
