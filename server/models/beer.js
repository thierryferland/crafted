var mongoose = require('mongoose');
var config = require('../config');

var url_root = config.FAAS_BASE_URL + config.FAAS_API_URL + '/' + config.FAAS_API_VERSION;

var beerSchema = new mongoose.Schema({
	name : {
		type : String
	},
	ingredients : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Produce'
	}],
	image : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Picture'
	}],
	tags : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Tag'
	}],
	producer : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Producer'
	}],
});

beerSchema.virtual('getDescription').get(function() {
	var description = this.description;
	return description;
});

beerSchema.virtual('image_url').get(function() {
	if ( typeof this.image[0] == 'undefined') {
		this.image[0] = config.DEFAULT_IMAGE_ID;
	};
	var url = url_root + '/image/id/' + this.image[0];
	return url;
});

beerSchema.virtual('small_image_url').get(function() {
	if ( typeof this.image[0] == 'undefined') {
		this.image[0] = config.DEFAULT_IMAGE_ID;
	};
	var url = url_root + '/image/small/id/' + this.image[0];
	return url;
});

beerSchema.set('toJSON', {
	virtuals : true
});

beerSchema.pre('remove', function(next) {
	this.model('Picture').findOneAndRemove({
		_id : this.image[0]
	}, next);
});

module.exports = beerSchema;
