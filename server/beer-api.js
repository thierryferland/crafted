var express = require('express');
var status = require('http-status');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var config = require('./config');
var jwt = require('jwt-simple');
var moment = require('moment');
var fileUpload = require('express-fileupload');

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
		next();
	}


	api.get('/beer', wagner.invoke(function(Beer) {
		return function(req, res) {
			Beer.find().sort({
				_id : 1
			}).populate('image').populate('tags').limit(50).exec(function(error, beers) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					beers : beers
				});
			});
		};
	}));

	api.post('/beer/add', ensureAuthenticated, wagner.invoke(function(Beer) {
		return function(req, res) {
			var beer = new Beer(req.body);
			beer.save(function(error, beer) {
				if (error) {
					console.log(error.toString());
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					beer : beer
				});
			});

		};
	}));

	api.post('/tag/add', ensureAuthenticated, wagner.invoke(function(Tag) {
		return function(req, res) {
			var tag = new Tag(req.body);
			tag.category = 'beer';
			tag.save(function(error, tag) {
				if (error) {
					console.log(error.toString());
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					tag : tag
				});
			});

		};
	}));

	api.post('/beer/edit/:id', ensureAuthenticated, wagner.invoke(function(Beer) {
		return function(req, res) {
			Beer.findOneAndUpdate({
				_id : req.params.id
			}, req.body, function(error, beer) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!beer) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					beer : beer
				});
			});
		};
	}));

	api.post('/beer/delete/:id', ensureAuthenticated, wagner.invoke(function(Beer) {
		return function(req, res) {
			Beer.findOne({
				_id : req.params.id
			}, function(error, beer) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!beer) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				beer.remove(function(error) {
					if (error) {
						return res.status(status.INTERNAL_SERVER_ERROR).json({
							error : error.toString()
						});
					}
					res.send('Beer deleted');
				});

			});
		};
	}));

	api.get('/beer/name/:name', wagner.invoke(function(Beer) {
		return function(req, res) {
			Beer.findOne({
				name : req.params.name
			}).populate('ingredients').populate('tags').populate('image').exec(function(error, beer) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				if (!beer) {
					return res.status(status.NOT_FOUND).json({
						error : 'Not found'
					});
				}
				res.json({
					beer : beer
				});
			});
		};
	}));

	api.get('/beer/search/name/:name', wagner.invoke(function(Beer) {
		return function(req, res) {
			var pattern = req.params.name.replace(/ /g, ".*") + '.*';
			Beer.find({
				name : {
					$regex : pattern,
					$options : 'ix'
				}
			}).populate('tags').sort({
				_id : 1
			}).limit(10).exec(function(error, beers) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					results : beers
				});
			});
		};
	}));

	api.get('/beer/tag/search/name/:name?', wagner.invoke(function(Tag) {
		return function(req, res) {
			if (req.params.name) {
				var pattern = req.params.name.replace(/ /g, ".*") + '.*';
				filter = {
					name : {
						$regex : pattern,
						$options : 'ix'
					}
				};
			} else {
				filter = {};
			};
			Tag.find(filter).sort({
				_id : 1
			}).limit(10).exec(function(error, tags) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					results : tags
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

	api.get('/beer/ingredient/:name', wagner.invoke(function(Beer) {
		return function(req, res) {
			Beer.find({
				ingredients : req.params.name
			}).sort({
				_id : 1
			}).exec(function(error, beers) {
				if (error) {
					return res.status(status.INTERNAL_SERVER_ERROR).json({
						error : error.toString()
					});
				}
				res.json({
					beers : beers
				});
			});
		};
	}));

	api.get('/', function(req, res) {
		res.send('This is the beer API');
	});

	return api;
};
