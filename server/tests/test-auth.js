var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Backend Auth', function() {
  var User;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../server'));

    server = app.listen(3000);

    // Make Recipe model available in tests
    User = models.User;;
    
  });

  after(function(done) {
    server.close();
    done();
  });
  
  beforeEach(function(done) {
    // Make sure recipes are empty before each test
    //User.remove({}, function(error) {
    //  assert.ifError(error);
    //});

    done();
  });
  
  it('gets an error when not sending the clientId', function(done) {
    // Create a single category
    var url = URL_ROOT + '/auth/facebook';
    superagent.post(URL_ROOT, function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 500);
      assert.equal(res.text, "Hello, biiitch!");
      done();
    });
  });

    
});