var sinon = require('sinon'),
  supertest = require('supertest'),
  oembed = require('../lib/oembed'),
  app = require('../lib/app');

require('sinon-mocha').enhance(sinon);

describe('Local tests', function(){
  it("should set CORS header", function(done){
    var youtubeUrl = 'http://www.youtube.com/watch?v=3Yuqxl284cg';

    sinon.stub(oembed, 'fromUrl', function(url, callback){
      callback(null, { 'foo': 'bar' });
    });

    supertest(app)
      .get('/v1.json?url=' + encodeURIComponent(youtubeUrl))
      .expect('access-control-allow-origin', '*')
      .end(done);
  });
});
