var fs = require('fs'),
  oembed = require('../lib/oembed'),
  u = require('underscore'),
  assert = require('assert'),
  request = require('request');

describe('Live tests', function(){
  var examples = JSON.parse(fs.readFileSync('test/examples.json'));

  u.each(examples, function(expected, url){
    it("should succeed for " + url, function(done){
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

          // verify that thumbnail exists
          request({
            url: result.thumbnail_url,
            method: 'HEAD'
          }, function(thumbErr){
            done(thumbErr);
          });
        }
      });
    });
  });
});
