var express = require('express');
var status = require('http-status');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./config');
var jwt = require('jwt-simple');
var moment = require('moment');
var fileUpload = require('express-fileupload');
var sharp = require('sharp');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyParser.json());
	api.use(bodyParser.urlencoded({
		extended : true
	}));
	api.use(fileUpload());

	/*
	 |--------------------------------------------------------------------------
	 | Login Required Middleware
	 |--------------------------------------------------------------------------
	 */
	function ensureAuthenticated(req, res, next) {
		if (!req.header('Authorization')) {
			return res.status(401).send({
				message : 'Please make sure your request has an Authorization header'
			});
		}
		var token = req.header('Authorization').split(' ')[1];

		var payload = null;
		try {
			payload = jwt.decode(token, config.TOKEN_SECRET);
		} catch (err) {
			return res.status(401).send({
				message : err.message
			});
		}

		if (payload.exp <= moment().unix()) {
			return res.status(401).send({
				message : 'Token has expired'
			});
		}
		req.user = payload.sub;
		console.log(req.user);
		next();
	}

	api.post('/upload/multimage', ensureAuthenticated, wagner.invoke(function(Picture) {
		return function(req, res) {
			console.log(req.body);
			console.log(req.files.file);
			//var imgPath = req.body.file.path;
			var picture = new Picture({
				description : req.body.description
			});
			picture.image.data = req.files['file[0]'].data;
			picture.image.contentType = req.files['file[0]'].mimetype;
			picture.save(function(error, picture) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				console.log('img saved to mongo');
				res.json({
					image : picture
				});
			});
		};
	}));

	api.post('/upload/image', ensureAuthenticated, wagner.invoke(function(Picture) {
		return function(req, res) {
			console.log(req.files.file);
			//var imgPath = req.body.file.path;
			var picture = new Picture({
				description : req.body.description
			});
			picture.image.data = req.files.file.data;
			picture.image.contentType = req.files.file.mimetype;
			picture.save(function(error, picture) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				sharp(picture.image.data).resize(300).toBuffer().then(function(buffer) {
					picture.small.data = buffer;
					picture.small.contentType = req.files.file.mimetype;
					sharp(picture.image.data).resize(50).toBuffer().then(function(buffer) {
						picture.tiny.data = buffer;
						picture.tiny.contentType = req.files.file.mimetype;
						picture.save(function(error, picture) {
							if (error) {
								console.log("error while saving smaller images");
							}
						});
					});
				});
				res.json({
					image : picture
				});
			});

		};
	}));

	api.get('/image/id/:id', wagner.invoke(function(Picture) {
		return function(req, res) {
			Picture.findOne({
				_id : req.params.id
			}, function(error, picture) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!picture) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				//console.log(picture);
				res.contentType(picture.image.contentType);
				res.send(picture.image.data);
			});
		};
	}));

	api.get('/image/small/id/:id', wagner.invoke(function(Picture) {
		return function(req, res) {
			Picture.findOne({
				_id : req.params.id
			}, function(error, picture) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!picture) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				if (picture.small.data) {
					res.contentType(picture.small.contentType);
					res.send(picture.small.data);
				} else {
					console.log("creating smaller image");
					sharp(picture.image.data).resize(300).toBuffer().then(function(buffer) {
						picture.small.data = buffer;
						picture.small.contentType = picture.image.contentType;
						res.contentType(picture.image.contentType);
						res.send(buffer);
						picture.save(function(error, picture) {
							if (error) {
								console.log("error while saving smaller images");
							}
						});
					});
				}

			});
		};
	}));
	
	api.get('/image/tiny/id/:id', wagner.invoke(function(Picture) {
		return function(req, res) {
			Picture.findOne({
				_id : req.params.id
			}, function(error, picture) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!picture) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				if (picture.tiny.data) {
					res.contentType(picture.tiny.contentType);
					res.send(picture.tiny.data);
				} else {
					console.log("creating tiny image");
					sharp(picture.image.data).resize(300).toBuffer().then(function(buffer) {
						picture.tiny.data = buffer;
						picture.tiny.contentType = picture.image.contentType;
						res.contentType(picture.image.contentType);
						res.send(buffer);
						picture.save(function(error, picture) {
							if (error) {
								console.log("error while saving tiny images");
							}
						});
					});
				}

			});
		};
	}));

	api.get('/', function(req, res) {
		res.send('This is the Image API!');
	});

	return api;
};
