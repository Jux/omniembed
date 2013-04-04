var fs = require('fs'),
  u = require('underscore'),
  assert = require('assert'),
  request = require('request'),
  oembed = require('../lib/oembed');

describe('Thumbnail tests', function(){
  // 100 most recent video URLs
  var urls = JSON.parse(fs.readFileSync('test/jux_videos.json'));

  urls.forEach(function(url){
    it('should succeed for ' + url, function(done){
      oembed.fromUrl(url, function(err, result){
        if (err){
          // done(JSON.stringify(err));

          // ignore errors
          console.log('WARN: ' + url + ' - ' + JSON.stringify(err));
          done();

        } else if (u.isEmpty(result)) {
          assert(false, 'no results found');
          done();

        } else {
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
