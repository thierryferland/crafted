var assert = require('assert');
var produceSchema = require('../models/produce');
var recipeSchema = require('../models/recipe');
var pictureSchema = require('../models/picture');
var userSchema = require('../models/user');
var fs = require('fs');
var mongoose = require('mongoose');


describe('Mongoose Schemas', function() {
  var Produce = mongoose.model('Produce', produceSchema, 'produces');
  var Recipe = mongoose.model('Recipe', recipeSchema, 'recipes');
  var Picture = mongoose.model('Picture', pictureSchema, 'pictures');
  var User = mongoose.model('User', userSchema, 'users');
  var produce;
  var recipe;
  var picture;
  var succeeded;
  var user;
  
  var imgPath = 'client/images/background.jpg';

  describe('Produce', function() {
    it('has a `getName` virtual', function() {
      var produce = new Produce({ name: 'Potatoes' });

      assert.equal(produce.getName, 'Potatoes');
      ++succeeded;
    });
    
    it('has a name field that\'s a required string', function(done) {
      var produce = new Produce({});

      produce.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['name'].kind, 'required');

        produce.name = 'Tomatoes';
        assert.equal(produce.name, 'Tomatoes');
        ++succeeded;
        done();
      });
    });
  });
  
  describe('User', function() {
    it('has a `getToken` virtual', function() {
      var user = new User({firstname: 'Mario',
  								lastname: 'Bros',
  								pseudo: 'Bro',
  								email: 'thierry.ferland@gmail.com',
  								token: 'kasdfhdishgfpdoihvsfn'});

      assert.equal(user.getToken, 'kasdfhdishgfpdoihvsfn');
      ++succeeded;
    });
    
    it('has a fist name, last name, pseudo and emails field which are required strings', function(done) {
      var user = new User({});

      user.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['firstname'].kind, 'required');
        assert.equal(err.errors['lastname'].kind, 'required');
        assert.equal(err.errors['pseudo'].kind, 'required');
        assert.equal(err.errors['email'].kind, 'required');

        user.firstname = 'Mario';
        user.lastname = 'Mario';
        user.pseudo = 'Mario';
        user.email = 'Mario@gmail.com';
        user.token = 'Mario';
        assert.equal(user.firstname, 'Mario');
        assert.equal(user.lastname, 'Mario');
        assert.equal(user.pseudo, 'Mario');
        assert.equal(user.email, 'Mario@gmail.com');
        assert.equal(user.token, 'Mario');
        ++succeeded;
        done();
      });
    });
  });
  
  
  describe('Recipe', function() {
    it('has a `getDescription` virtual', function() {
      var recipe = new Recipe({ description: 'Spaghetti Bolognese',
      							 _id: 'SB1' });

      assert.equal(recipe.getDescription, 'Spaghetti Bolognese');
      ++succeeded;
    });
    
    it('has a _id field that\'s a required string', function(done) {
      var recipe = new Recipe({});

      recipe.validate(function(err) {
        assert.ok(err);
        assert.equal(err.errors['_id'].kind, 'required');

        recipe._id = 'SB1';
        assert.equal(recipe._id, 'SB1');
        ++succeeded;
        done();
      });
    });
    
    it('has a ingredients field that\'s a list of produces', function() {
      var recipe = new Recipe({description: 'Spaghetti Bolognese',
      							_id: 'SB1',
      							ingredients: ['Tomatoes'] });

      assert.equal(recipe.ingredients.length, 1);
      recipe.ingredients.push('Potatoes');
      assert.equal(recipe.ingredients.length, 2);
      assert.equal(recipe.ingredients[0], 'Tomatoes');
      assert.equal(recipe.ingredients[1], 'Potatoes');
       ++succeeded;
    });
    
  });
  
  describe('Picture', function() {
  	
  	it('has a image field with contentType image/jpg', function(done) {
  	  var image_data = fs.readFileSync(imgPath);
      var picture = new Picture({image:{data:image_data,contentType:'image/jpg'}});
      			 
      picture.validate(function(err) {
        assert.equal(picture.image.contentType, 'image/jpg');
        ++succeeded;
        done();
      });
    });
  	
    it('has a `getDescription` virtual', function() {
      var picture = new Picture({ description: 'Carrots',
      							 _id: 'CA1' });

      assert.equal(picture.getDescription, 'Carrots');
      ++succeeded;
    });
      
  });
  
  after(function(done) {
    done();
  });
});
