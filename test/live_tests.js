var fs = require('fs'),
  oembed = require('../lib/oembed'),
  u = require('underscore'),
  assert = require('assert');

describe('Live tests', function(){
  var examples = JSON.parse(fs.readFileSync('test/examples.json'));

  u.each(examples, function(expected, url){
    it("should succeed for " + url, function(done){
      oembed.fromUrl(url, function(err, result){
        if (!err){
          assert(!u.isEmpty(result), 'should not be empty');

          // check that example data is subset of the response
          u.each(expected, function(val, key){
            assert.strictEqual(result[key], val);
          });
        }

        done(err);
      });
    });
  });
});
