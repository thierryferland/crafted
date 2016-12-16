var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
	name : String,
	color : String,
	abreviation : String,
	category : String
});

tagSchema.set('toJSON', {
	virtuals : true
});

module.exports = tagSchema;
