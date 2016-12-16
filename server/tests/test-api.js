var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Recipe API', function() {
  var server;
  var Recipe;
  var Picture;
  //var Produce;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../api')(wagner));

    server = app.listen(3000);

    // Make Recipe model available in tests
    Recipe = models.Recipe;
    Picture = models.Picture;
    Produce = models.Produce;
    
    // Make sure images are empty before test
    Picture.remove({}, function(error) {
      assert.ifError(error);
    });
    
    // Make sure produces are empty before test
    Produce.remove({}, function(error) {
      assert.ifError(error);
    });
    
  });

  after(function(done) {
    server.close();
    done();
  });
  
  beforeEach(function(done) {
    // Make sure recipes are empty before each test
    Recipe.remove({}, function(error) {
      assert.ifError(error);
    });

    done();
  });


  it('prints out "Hello, biiitch" when user goes to /', function(done) {
    superagent.get(URL_ROOT, function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      assert.equal(res.text, "Hello, biiitch!");
      done();
    });
  });
  
  it('can load a recipe by id', function(done) {
    // Create a single category
    Recipe.create({ description: 'Spaghetti Bolognese',
      				_id: 'SB1' }, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/recipe/id/SB1';
      // Make an HTTP request to localhost:3000/recipe/id/SB1
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'SB1' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result.recipe);
        assert.equal(result.recipe._id, 'SB1');
        done();
      });
    });
  });
  
  it('can load all recipes that have a certain ingredient', function(done) {
    var recipes = [
      { _id: 'SB1', description: 'Spaghetti Bolognese', ingredients: ['Tomatoes','Carrots'] },
      { _id: 'RV1', description: 'Roasted Vegetables', ingredients: ['Sweet Potatoes','Carrots'] },
      { _id: 'CB1', description: 'Chicken Breast', ingredients: ['Chicken','Lemon'] },
      { _id: 'TS1', description: 'Tomato Salad', ingredients: ['Tomatoes','Mozarella'] },
    ];

    // Create 4 categories
    Recipe.create(recipes, function(error, recipes) {
      var url = URL_ROOT + '/recipe/ingredient/Carrots';
      // Make an HTTP request to localhost:3000/recipe/ingredient/Carrots
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.recipes.length, 2);
        // Should be in ascending order by _id
        assert.equal(result.recipes[0]._id, 'RV1');
        assert.equal(result.recipes[1]._id, 'SB1');
        done();
      });
    });
  });
  
  it('can load all recipes', function(done) {
    var recipes = [
      { _id: 'SB1', description: 'Spaghetti Bolognese', ingredients: ['Tomatoes','Carrots'] },
      { _id: 'RV1', description: 'Roasted Vegetables', ingredients: ['Sweet Potatoes','Carrots'] },
      { _id: 'CB1', description: 'Chicken Breast', ingredients: ['Chicken','Lemon'] },
      { _id: 'TS1', description: 'Tomato Salad', ingredients: ['Tomatoes','Mozarella'] },
      { _id: 'RS1', description: 'Aragula Salad', ingredients: ['Aragula','Apple'] },
    ];

    // Create 4 recipes
    Recipe.create(recipes, function(error, recipes) {
      var url = URL_ROOT + '/recipe';
      // Make an HTTP request to localhost:3000/recipe
      superagent.get(url, function(error, res) {
        assert.ifError(error);
        var result;
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.equal(result.recipes.length, 5);
        // Should be in ascending order by _id
        assert.equal(result.recipes[0]._id, 'CB1');
        assert.equal(result.recipes[1]._id, 'RS1');
        done();
      });
    });
  });
  
  it('can save a produce with its image', function(done) {
  	var url = URL_ROOT + '/produce/add';
  	var produce = { description: 'Carrots'};
    var imgPath = 'client/images/background.jpg';
    var contentType = 'image/jpg';
    superagent.post(url)
    	.type('form')
    	.send({ imgPath: imgPath })
    	.send({ produce: produce })
    	.send({ contentType: contentType })
    	.end( function(error, res) {
      		assert.ifError(error);
      		assert.equal(res.status, 200);
      		//assert.equal(res.text, "Hello, biiitch!");
      		done();
    	});
  });
  
  it('can return produces by name', function(done) {
  	var url = URL_ROOT + '/produce/name/Carrots';
  	
    superagent.get(url, function(error, res) {
      assert.ifError(error);
      var result;
      assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
      assert.ok(result.produce);
      assert.equal(result.produce.name, 'Carrots');
      var url = URL_ROOT + '/image/id/' + result.produce.image[0];
      assert.equal(result.image_url, url);
      done();
    });
  });
  
  it('can serve an image', function(done) {

  	Produce.findOne({ name: 'Carrots' }, 'name image',  function(error, produce) {
													        if (error) return handleError(error);
													        assert.equal(produce.name, 'Carrots');
														  	var url = URL_ROOT + '/image/id/' + produce.image[0];
														  	superagent.get(url, function(error, res) {
															      assert.ifError(error);
															      assert.equal(res.status, 200);
															      assert.equal(res.type, 'image/jpg');
															      //assert.equal(res.text, "Hello, biiitch!");
															      done();
															    });
													    });
	//assert.equal(url, 'Car');
	
  });
    
});