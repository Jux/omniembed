var sinon = require('sinon'),
  supertest = require('supertest'),
  oembed = require('../lib/oembed'),
  app = require('../lib/app');

require('sinon-mocha').enhance(sinon);

describe('Local tests', function(){
  it("should set the CORS header", function(done){
    var youtubeUrl = 'http://www.youtube.com/watch?v=3Yuqxl284cg';
    var json = { foo: 'bar' };

    sinon.stub(oembed, 'fromUrl', function(url, callback){
      callback(null, json);
    });

    supertest(app)
      .get('/v1.json?url=' + encodeURIComponent(youtubeUrl))
      .expect('access-control-allow-origin', '*')
      .expect(json, done);
  });

  it("should accept JSONP", function(done){
    var youtubeUrl = 'http://www.youtube.com/watch?v=3Yuqxl284cg';

    sinon.stub(oembed, 'fromUrl', function(url, callback){
      callback(null, { 'foo': 'bar' });
    });

    supertest(app)
      .get('/v1.json?callback=callee&url=' + encodeURIComponent(youtubeUrl))
      .expect('callee && callee({\n  "foo": "bar"\n});', done);
  });

  it("should handle private videos", function(done){
    var youtubeUrl = 'http://www.youtube.com/watch?v=VtVA4JAkjDQ';
    var json = {
      status: 403,
      message: "Not authorized"
    };

    sinon.stub(oembed, 'fromUrl', function(url, callback){
      callback(json);
    });

    supertest(app)
      .get('/v1.json?url=' + encodeURIComponent(youtubeUrl))
      .expect(502, json, done);
  });
});
