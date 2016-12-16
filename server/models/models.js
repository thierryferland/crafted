var mongoose = require('mongoose');
var _ = require('underscore');
var config = require('../config');

module.exports = function(wagner) {
	
	if (config.ENV == "Prod") {
		var database = 'mongodb://'+config.MONGOUSER+':'+config.MONGOPASS+'@localhost:27017/crafted';
		console.log(database);
	}
	else {
		var database = 'mongodb://localhost:27017/crafted';
	}
	
	mongoose.connect(database);

	wagner.factory('db', function() {
		return mongoose;
	});

	var Produce = mongoose.model('Produce', require('./produce'), 'produces');
	var Picture = mongoose.model('Picture', require('./picture'), 'pictures');
	var User = mongoose.model('User', require('./user'), 'users');
	var Location = mongoose.model('Location', require('./location'), 'locations');
	var Tag = mongoose.model('Tag', require('./tag'), 'tags');
	var Beer = mongoose.model('Beer', require('./beer'), 'beers');
	var Producer = mongoose.model('Producer', require('./producer'), 'producers');

	var models = {
		Produce : Produce,
		Picture : Picture,
		User : User,
		Location : Location,
		Tag : Tag,
		Producer : Producer,
		Beer : Beer
	};

	// To ensure DRY-ness, register factories in a loop
	_.each(models, function(value, key) {
		wagner.factory(key, function() {
			return value;
		});
	});

	return models;
};
