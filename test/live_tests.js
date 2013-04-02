/*global require, describe, it */
'use strict';

var oembed = require('../lib/oembed'),
  u = require('underscore'),
  assert = require('assert');

describe('Live tests', function(){
  var examples = {
    'http://www.youtube.com/watch?v=3Yuqxl284cg': {
      "height": 1080,
      "provider_name": "YouTube",
      "title": "M.I.A. - Bad Girls",
      "author_name": "MIAVEVO",
      "author_url": "http://www.youtube.com/user/MIAVEVO",
      "width": 1920,
      "thumbnail_height": 1080,
      "provider_url": "http://www.youtube.com/",
      "thumbnail_width": 1920,
      // "html": "<iframe width=\"480\" height=\"270\" src=\"http://www.youtube.com/embed/3Yuqxl284cg?feature=oembed\" frameborder=\"0\" allowfullscreen></iframe>",
      "thumbnail_url": "http://i4.ytimg.com/vi/3Yuqxl284cg/maxresdefault.jpg?feature=og",
      "version": "1.0",
      "type": "video"
      // "description": "Vote for video of the year here!  http://on.mtv.com/P7JsT6\n\n\n\nMusic video by M.I.A. performing Bad Girls. Buy now! http://www.smarturl.it/MIABadGirls © 2012 Interscope"
    }
  };

  u.each(examples, function(expected, url){
    it("should succeed for " + url, function(done){
      oembed.fromUrl(url, function(err, result){
        if (!err){
          assert(!u.isEmpty(result), 'should not be empty');

          // check that example specified above is subset of the response
          u.each(expected, function(val, key){
            assert.strictEqual(result[key], val);
          });
        }

        done(err);
      });
    });
  });
});
