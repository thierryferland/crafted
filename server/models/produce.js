var mongoose = require('mongoose');
var config = require('../config');

var url_root = config.FAAS_BASE_URL + config.FAAS_API_URL + '/' + config.FAAS_API_VERSION;

var produceSchema = new mongoose.Schema({
	name : {
		type : String,
		required : true
	},
	image : [{
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Picture'
	}]
});

produceSchema.virtual('image_url').get(function() {
	if (typeof this.image[0] == 'undefined') {
		this.image[0] = config.DEFAULT_IMAGE_ID;
	};
	var url = url_root + '/image/id/' + this.image[0];

	return url;
});

produceSchema.virtual('small_image_url').get(function() {
	if (typeof this.image[0] == 'undefined') {
		this.image[0] = config.DEFAULT_IMAGE_ID;
	};
	var url = url_root + '/image/small/id/' + this.image[0];

	return url;
});

produceSchema.set('toJSON', {
	virtuals : true
});

produceSchema.pre('remove', function(next) {
	this.model('Picture').findOneAndRemove({
		_id : this.image[0]
	}, next);
});

produceSchema.pre('save', function(next) {
	if (!this.image || this.image.length ==0) {
		this.image.push(config.DEFAULT_IMAGE_ID);
	};
	next();
});

module.exports = produceSchema; 