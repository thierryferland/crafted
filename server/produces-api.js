var express = require('express');
/**To send status by name instead of ny number**/
var status = require('http-status');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');
var moment = require('moment');

var config = require('./config');

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
		next();
	}


	api.get('/produce', wagner.invoke(function(Produce) {
		return function(req, res) {
			Produce.find().sort({
				_id : 1
			}).limit(10).populate('image', 'url').exec(function(error, produces) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					produces : produces
				});
			});
		};
	}));

	api.post('/produce/add', ensureAuthenticated, wagner.invoke(function(Produce) {
		return function(req, res) {
			var produce = new Produce(req.body);
			produce.save(function(error, produce) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				Produce.populate(produce, {
					path : 'image',
					select : 'url'
				}, function(error, produce) {
					if (error) {
						return res.status(status.INTERNAL_SERVER_ERROR).json({
							error : error.toString()
						});
					}
					res.json({
						produce : produce
					});
				});
			});

		};
	}));

	api.post('/produce/edit/:id', ensureAuthenticated, wagner.invoke(function(Produce) {
		return function(req, res) {
			Produce.findOneAndUpdate({
				_id : req.params.id
			}, req.body, function(error, produce) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!produce) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					produce : produce
				});
			});
		};
	}));

	api.post('/produce/delete/:id', ensureAuthenticated, wagner.invoke(function(Produce) {
		return function(req, res) {
			Produce.findOne({
				_id : req.params.id
			}).populate('image', 'url').exec(function(error, produce) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!produce) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				produce.remove(function(error) {
					if (error) {
						return res.status(status.INTERNAL_SERVER_ERROR).json({
							error : error.toString()
						});
					}
					res.send('Produce deleted');
				});

			});
		};
	}));

	api.get('/produce/name/:name', wagner.invoke(function(Produce) {
		return function(req, res) {
			Produce.findOne({
				name : req.params.name
			}).populate('image', 'url').exec(function(error, produce) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!produce) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					produce : produce
				});
			});
		};
	}));

	api.get('/produce/search/name/:name?', wagner.invoke(function(Produce) {
		return function(req, res) {
			if (req.params.name) {
				var pattern = req.params.name.replace(/ /g, ".*") + '.*';
				var filter = {
					name : {
						$regex : pattern,
						$options : 'ix'
					}
				};
			} else {
				var filter = {};
			};
			Produce.find(filter).sort({
				_id : 1
			}).limit(10).populate('image', 'url').exec(function(error, produces) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					results : produces
				});
			});
		};
	}));

	api.get('/', function(req, res) {
		res.send('This is the produces API');
	});

	return api;
};
