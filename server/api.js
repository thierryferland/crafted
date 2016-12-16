var express = require('express');
var status = require('http-status');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./config');
var jwt = require('jwt-simple');
var moment = require('moment');
var fileUpload = require('express-fileupload');
var lwip = require('lwip');

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


	api.get('/me', ensureAuthenticated, wagner.invoke(function(User) {
		return function(req, res) {
			User.findById(req.user, function(err, user) {
				res.send(user);
			});
		};
	}));

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
				console.log('img saved to mongo');
				res.json({
					image : picture
				});
			});
		};
	}));

	api.get('/user/id/:id', wagner.invoke(function(User) {
		return function(req, res) {
			User.findOne({
				_id : req.params.id
			}, function(error, user) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!user) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					user : user
				});
			});
		};
	}));

	api.get('/facebook/me/:id', wagner.invoke(function(User) {
		return function(req, res) {
			User.findOne({
				facebook : req.params.id
			}, function(error, user) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!user) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
				var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
				accessToken = {
					'access_token' : user.token
				};
				console.log(accessToken);
				request.get({
					url : graphApiUrl,
					qs : accessToken,
					json : true
				}, function(err, response, profile) {
					if (response.statusCode !== 200) {
						return res.status(500).send({
							message : profile.error.message
						});
					}
					res.json(profile);
				});
			});
		};
	}));

	api.get('/facebook/user/:id/pages', wagner.invoke(function(User) {
		return function(req, res) {
			User.findOne({
				facebook : req.params.id
			}, function(error, user) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!user) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
				var graphApiUrl = 'https://graph.facebook.com/v2.5/' + user.facebook + '/accounts';
				accessToken = {
					'access_token' : user.token
				};
				console.log(accessToken);
				request.get({
					url : graphApiUrl,
					qs : accessToken,
					json : true
				}, function(err, response, profile) {
					if (response.statusCode !== 200) {
						return res.status(500).send({
							message : profile.error.message
						});
					}
					res.json(profile);
				});
			});
		};
	}));

	api.get('/facebook/user/:id/page/:pageid', wagner.invoke(function(User) {
		return function(req, res) {
			User.findOne({
				facebook : req.params.id
			}, function(error, user) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!user) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				var fields = ['id', 'about', 'category', 'cover', 'description', 'engagement', 'location', 'name', 'picture', 'photos'];
				var graphApiUrl = 'https://graph.facebook.com/v2.5/' + req.params.pageid + '?fields=' + fields.join(',');
				accessToken = {
					'access_token' : user.token
				};
				console.log(accessToken);
				request.get({
					url : graphApiUrl,
					qs : accessToken,
					json : true
				}, function(err, response, profile) {
					if (response.statusCode !== 200) {
						console.log(profile.error.message);
						return res.status(500).send({
							message : profile.error.message
						});
					}
					res.json(profile);
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

				lwip.open(picture.image.data, 'jpg', function(error, image) {
					if (error) {
						return res.status(status.INTERNAL_SERVER_ERROR).json({
							error : error.toString()
						});
					}
					image.cover(300,150, function(error, image) {
						if (error) {
							return res.status(status.INTERNAL_SERVER_ERROR).json({
								error : error.toString()
							});
						};
						image.toBuffer('jpg', function(err, buffer) {
							if (error) {
								return res.status(status.INTERNAL_SERVER_ERROR).json({
									error : error.toString()
								});
							};
							res.contentType(picture.image.contentType);
							res.send(buffer);
						});
					});
				});

			});
		};
	}));

	api.get('/', function(req, res) {
		res.send('This is the Craft Beer API!');
	});

	return api;
};
