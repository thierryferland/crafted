var mongoose = require('mongoose');
var config = require('../config');

var url_root = config.FAAS_BASE_URL + config.IAPI_URL + '/' + config.IAPI_VERSION;

var pictureSchema = new mongoose.Schema({
  description: { type: String, required: false },  
  image: { data: Buffer, contentType: String },
  small: { data: Buffer, contentType: String },
  tiny: { data: Buffer, contentType: String }
});

pictureSchema.virtual('image_url').get(function() {
  var url = url_root + '/image/id/' + this._id;
  return url;
});

pictureSchema.virtual('url.original').get(function() {
	var url = url_root + '/image/id/' + this._id;
	return url;
});

pictureSchema.virtual('url.small').get(function() {
	var url = url_root + '/image/small/id/' + this._id;
	return url;
});

pictureSchema.virtual('url.tiny').get(function() {
	var url = url_root + '/image/tiny/id/' + this._id;
	return url;
});

pictureSchema.set('toJSON', {
   virtuals: true,
   transform: function(doc, ret, options) { delete ret.image; return ret; }
});


module.exports = pictureSchema;