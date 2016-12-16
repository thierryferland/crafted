var mongoose = require('mongoose');

var locationSchema = new mongoose.Schema({
  city: { type: String },
  country: { type: String },
  street: { type: String},
  latitude: { type: Number},
  longitude: { type: Number}
});

module.exports = locationSchema;
