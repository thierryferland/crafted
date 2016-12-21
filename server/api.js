var express = require('express');
var status = require('http-status');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./config');
var jwt = require('jwt-simple');
var moment = require('moment');

module.exports = function(wagner) {
	var api = express.Router();
	api.use(bodyParser.json());
	api.use(bodyParser.urlencoded({
		extended : true
	}));

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

	api.get('/', function(req, res) {
		res.send('This is the Craft Beer API!');
	});

	return api;
};
