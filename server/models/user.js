var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  firstname: { type: String},
  lastname: { type: String},
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, select: false },
  token: { type: String, required: false },
  facebook: String,
  picture: String
});

userSchema.virtual('getToken').get(function() {
  var token = this.token;
  return token;
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

module.exports = userSchema;
