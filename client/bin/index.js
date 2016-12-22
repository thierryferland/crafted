(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.beerBeerCard = function() {
  return {
  	controller: 'BeerCardController',
    templateUrl: 'templates/beer_card.html'
  };
};

},{}],2:[function(require,module,exports){
exports.BeerCardController = function($scope, $http, $attrs, cbConfig, efSelectService) {

	$scope.save = function($index, id) {
		var image = $scope.beers[$index].image?[$scope.beers[$index].image[0]._id]:[];
		data = {
			name : $scope.beers[$index].name,
			image : image
		};
		if (id) {
			url = cbConfig.beer_url + '/beer/edit/' + id;
			$http.post(url, data).success(function(data) {
				console.log('Answer sent!');
				$scope.beers[$index].is_editing = false;
				$scope.beers[$index].is_editing_image = false;
				//$scope.beers[$index] = data.beer;
			});
		} else {
			$http.post(cbConfig.beer_url + '/beer/add', data).success(function(data) {
				console.log('Answer sent!');
				$scope.beers[$index] = data.beer;
			});
		}
	};

	$scope.edit = function($index) {
		$scope.beers[$index].is_editing = true;
	};

	$scope.editImage = function($index) {
		$scope.beers[$index].is_editing_image = true;
	};

	$scope.delete = function(beer) {
		url = cbConfig.beer_url + '/beer/delete/' + beer._id;
		$http.post(url).success(function(resp) {
			if (!resp.code) {
				index = $scope.beers.indexOf(beer);
				$scope.beers.splice(index, 1);
				console.log('Beer deleted!');
			}
		});
	};

	$scope.cancel = function($index) {
		$scope.beers[$index].is_editing = false;
		$scope.beers[$index].is_editing_image = false;
		if (!$scope.beers[$index].id) {
			$scope.beers.pop();
		}
	};

	$scope.select = function(beer) {
		efSelectService.select(beer, 'md-warn md-raised');
	};

	$scope.onDragStart = function() {
		return function(event, draggedElement, data) {
			// var dragImage = document.createElement('img');
			// dragImage.src = data.image_url;
			// dragImage.size = '150px';
			// dragImage.style.width = '150px';
			// event.dataTransfer.setDragImage(dragImage, 0, 0);
			event.dataTransfer.effectAllowed = "copy";
		};
	};

	$scope.selectService = efSelectService;
	if ($attrs.efSelectable != null) {
		$scope.selectable = true;
	}
	if ($attrs.efEditable != null) {
		$scope.editable = true;
	}

};

exports.BeerController = function($scope, $http, cbConfig) {

	$scope.searchUrl = cbConfig.beer_url + '/beer/search/name/';
	$scope.BEER_URL = cbConfig.beer_url;
	$scope.photo_upload_description = 'beer';
	$scope.searchText = '';
	$scope.displayLimit=5;

	$http.get($scope.BEER_URL + '/beer').success(function(data) {
		$scope.beers = data.beers;
	});

	$scope.add = function(text) {
		$scope.image = null;
		$scope.beers.push({
			'name' : text,
			'is_editing' : true,
			'is_editing_image' : true
		});
	};

};

exports.BeerPageController = function($scope, $stateParams, $http, cbConfig) {

	$scope.searchText = null;
	$scope.selectedItem = null;
	$scope.searchUrl = cbConfig.papi_url + '/produce/search/name/';
	$scope.searchTag = "";
	$scope.selectedTag = null;
	$scope.searchTagUrl = cbConfig.beer_url + '/beer/tag/search/name/';
	$scope.BEER_URL = cbConfig.beer_url;
	$scope.PAPI_URL = cbConfig.papi_url;
	
	data = {};
	$http.get($scope.BEER_URL + '/beer/name/' + $stateParams.name).success(function(data) {
		$scope.beer = data.beer;
	});

	$scope.querySearch = function(query) {
		return $http.get($scope.searchUrl + encodeURI(query)).then(function(response) {
			$scope.items = response.data.results;
			return response.data.results;
		});
	};
	
	$scope.tagSearch = function(query) {
		return $http.get($scope.searchTagUrl + encodeURI(query)).then(function(response) {
			$scope.items = response.data.results;
			return response.data.results;
		});
	};

	/**
	 * Create filter function for a query string
	 */
	function createFilterFor(query) {

		return function filterFn(item) {
			return (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0);
		};
	};

	/**
	 * Return the proper object when the append is called.
	 */
	$scope.transformChip = function(chip) {

		// If it is an object, it's already a known chip
		if (angular.isObject(chip)) {
			return chip;
		}

		// Otherwise, create a new one
		return {
			name : chip,
			type : 'new'
		};
	};

	$scope.save = function() {
		data = $scope.beer;
		url = cbConfig.beer_url + '/beer/edit/' + $scope.beer.id;
		$http.post(url, data).success(function(data) {
			console.log('Answer sent!');
			$scope.beer.is_editing = false;
			$scope.beer.is_editing_image = false;
		});
	};
	
	$scope.saveTag = function(index,chip) {
		if (!chip.id) {
		data = chip;
		url = cbConfig.beer_url + '/tag/add';
		$http.post(url, data).success(function(data) {
			console.log('Tag saved!');
			$scope.beer.tags[index-1] = data.tag;
			$scope.save();
		});			
		} else {
			$scope.save();
		}

	};

};


},{}],3:[function(require,module,exports){
exports.WelcomeController = function($scope, $http) {

	setTimeout(function() {
		$scope.$emit('WelcomeController');
	}, 0);
};

exports.ToolbarController = function($scope, $state, accountService, $rootScope, $mdMedia, $mdDialog, $auth) {

	$scope.logout = function() {

		if (!$auth.isAuthenticated()) {
			return;
		}
		$auth.logout().then(function() {
			$rootScope.data.isSignedin = false;
			$state.go('home');
		});

	};

	$scope.login = function(ev) {

		var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $rootScope.customFullscreen;
		$mdDialog.show({
			controller : 'LoginController',
			templateUrl : 'templates/login.html',
			targetEvent : ev,
			clickOutsideToClose : true,
			fullscreen : useFullScreen
		});
	};

	var originatorEv;
	$scope.openMenu = function($mdOpenMenu, ev) {
		originatorEv = ev;
		$mdOpenMenu(ev);
	};

	$scope.getProfile = function() {
		params = {};
		accountService.getProfile().then(function(response) {
			$scope.user = response.data;
		}).catch(function(response) {
			console.log(response.data.message);
		});
	};

	if ($auth.isAuthenticated()) {
		$rootScope.data.isSignedin = true;
		$scope.getProfile();
	}
};

exports.LoginController = function($scope, $state, $mdDialog, $mdMedia, $rootScope, $auth) {

	$scope.login = function() {
		$auth.login($scope.user).then(function(response) {
			console.log('You have successfully signed in!');
			$rootScope.data.isSignedin = true;
			$mdDialog.hide();
			$state.go('home');
			$state.reload();
		}).catch(function(response) {
			if (response.status == 401) {
				$mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Invalid Email/Password').textContent('The user/password combination is not recognized').ariaLabel('Unauthorized').ok('OK'));
			}
			$state.go('login');
			console.log(response.data.message);
		});
	};

	$scope.authenticate = function(provider) {
		$auth.authenticate(provider).then(function(response) {
			$rootScope.data.facebook_token = response.data.facebook;
			$rootScope.data.token = response.data.token;
			$mdDialog.hide();
			$rootScope.data.isSignedin = true;
			$state.go('home');
			$state.reload();
		}).catch(function(error) {
			if (error.error) {
				// Popup error - invalid redirect_uri, pressed cancel button, etc.
			} else if (error.data) {
				// HTTP response error from server
			} else {
			}
		});
	};

	$scope.signup = function() {
		$mdDialog.hide();
		$state.go("signup");
	};
};

exports.SignupController = function($scope, $state, $mdDialog, $auth) {
	$scope.signup = function() {
		$auth.signup($scope.user).then(function(response) {
			$auth.setToken(response);
			$state.go('home');
			console.log('You have successfully created a new account and have been signed-in');
		}).catch(function(response) {
			if (response.status == 409) {
				$mdDialog.show($mdDialog.alert().clickOutsideToClose(true).title('Existing User').textContent('This email is already linked to an account, please sign in').ariaLabel('Conflicting Sign Up').ok('Sign In'));
			}
			console.log(response.data.message);
			$state.go('login');
		});
	};
};

exports.LogoutController = function($scope, $state, $mdDialog, $rootScope, $auth) {

	if (!$auth.isAuthenticated()) {
		return;
	}
	$auth.logout().then(function() {
		$state.go('home');
	});
};

exports.SearchController = function($scope, cbConfig, $http) {

	$scope.searchText = '';

	$scope.querySearch = function(query) {
		//var results = query ? $scope.items.filter(createFilterFor(query)) : $scope.items;
		//return results;
		return $http.get($scope.searchUrl + encodeURI(query)).then(function(response) {
			$scope.items = response.data.results;
			return response.data.results;
		});
	};

	$scope.selectedItemChange = function(item) {
		//console.log(item);
	};

	$scope.searchTextChange = function(text) {
		// if (text == "") {
		// $http.get($scope.searchUrl + encodeURI(text)).then(function(response) {
		// $scope.items = response.data.results;
		// });
		// }
	};

	$scope.onSubmit = function(field) {
		var auto = document.getElementsByName('autocompleteField');
		for ( i = 0; i < auto.length; i++) {
			auto[i].blur();
		}
	};

	/**
	 * Create filter function for a query string
	 */
	function createFilterFor(query) {

		return function filterFn(item) {
			return (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0);
		};

	};

};

exports.PhotoUploadController = function($scope, $http, Upload, cbConfig) {

	//$scope.getPicture()
	$scope.upload = function(file, description) {
		Upload.upload({
			url : cbConfig.iapi_url + '/upload/image',
			data : {
				file : file,
				'description' : description
			}
		}).then(function(resp) {
			$scope.image = resp.data.image;
			$scope.shade = "A100";
			$scope.showDropZone = false;
			console.log('Success ' + resp.config.data.file.name + ' uploaded.');
		}, function(resp) {
			console.log('Error status: ' + resp.status);
		}, function(evt) {
			var progressPercentage = 100.0 * evt.loaded / evt.total;
			$scope.progress = progressPercentage;
			console.log('progress: ' + parseInt(progressPercentage) + '% ' + evt.config.data.file.name);
			if (progressPercentage == 100) {
				$scope.progress_mode = "indeterminate";
			}
		});
	};

	$scope.dragover = function($isDragging) {
		if ($isDragging) {
			$scope.shade = "800";
			$scope.$apply();
		} else {
			$scope.shade = "A100";
		}
		;
	};

	$scope.shade = "A100";
	$scope.progress_mode = "determinate";
};

exports.DropZoneController = function($scope, $http, efSelectService) {

	$scope.onDragEnter = function() {
		return function(event, dropzone, draggable, data) {
			$scope.shade = "800";
			$scope.$apply();
		};
	};

	$scope.onDragLeave = function() {
		return function(event, dropzone, draggable, data) {
			$scope.shade = "200";
			$scope.$apply();
		};
	};

	$scope.onDrop = function() {
		return function(event, dropzone, draggable, data) {
			$scope.items.push(data);
			$scope.shade = "200";
			$scope.$apply();
		};
	};

	$scope.drop = function() {
		$scope.items.push(efSelectService.drop());
	};

	$scope.shade = "200";
	$scope.selectService = efSelectService;
};

},{}],4:[function(require,module,exports){
exports.ProduceCardController = function($scope, $http, efConfig) {

	$scope.save = function($index, id) {
		var image = $scope.produces[$index].image?[$scope.produces[$index].image[0]._id]:[];
		data = {
			name : $scope.produces[$index].name,
			image : image
		};
		if (id) {
			url = efConfig.papi_url + '/produce/edit/' + id;
			$http.post(url, data).then(function(resp) {
				console.log('Answer sent!');
				$scope.produces[$index].is_editing = false;
				$scope.produces[$index].is_editing_image = false;
			});
		} else {
			$http.post('/papi/v1/produce/add', data).then(function(resp) {
				console.log('Answer sent!');
				$scope.produces[$index] = resp.data.produce;
			});
		}
	};

	$scope.edit = function($index) {
		$scope.produces[$index].is_editing = true;
	};

	$scope.editImage = function($index) {
		$scope.produces[$index].is_editing_image = true;
	};

	$scope.delete = function(produce) {
		url = efConfig.papi_url + '/produce/delete/' + produce._id;
		$http.post(url).then(function(resp) {
			if (!resp.code) {
				index = $scope.produces.indexOf(produce);
				$scope.produces.splice(index, 1);
				console.log('Produce deleted!');
			}
		});
	};

	$scope.cancel = function($index) {
		$scope.produces[$index].is_editing = false;
		if (!$scope.produces[$index].id) {
			$scope.produces.pop();
		}
	};
};

exports.ProducesController = function($scope, $http, efConfig) {

	$scope.searchUrl = efConfig.papi_url + '/produce/search/name/';
	$scope.photo_upload_description = 'produce';
	$scope.searchText = '';

	$http.get(efConfig.papi_url + '/produce').then(function(resp) {
		$scope.produces = resp.data.produces;
	});

	$scope.add = function(text) {
		$scope.image = null;
		$scope.produces.push({
			'name' : text,
			'is_editing' : true,
			'is_editing_image' : true
		});
	};

};


},{}],5:[function(require,module,exports){
exports.welcome = function() {
	return {
		controller : 'WelcomeController',
		templateUrl : '/templates/home.html'
	};
};

exports.convenience = function() {
	return {
		controller : 'Epicfood24Controller',
		templateUrl : '/templates/convenience.html'
	};
};

exports.logistics = function() {
	return {
		controller : 'EpiclogicController',
		templateUrl : '/templates/logistics.html'
	};
};

exports.cbToolbar = function() {
	return {
		controller : 'ToolbarController',
		templateUrl : '/templates/toolbar.html'
	};
};

exports.efMultipleChoice = function() {
	return {
		controller : 'LongSurveyController',
		templateUrl : '/templates/multiple_choice.html'
	};
};

exports.efFarmerProfile = function() {
	return {
		controller : 'EpicdataController',
		templateUrl : '/templates/transparency.html'
	};
};

exports.efPhotoUpload = function() {
	return {
		controller : 'PhotoUploadController',
		templateUrl : '/templates/photo_upload.html',
		scope : {
			image : '=',
			showDropZone : '='
		}
	};
};

exports.efDropZone = function() {
	return {
		controller : 'DropZoneController',
		templateUrl : '/templates/drop_zone.html',
		scope : {
			items : '='
		}
	};
};

exports.efSearch = function() {
	return {
		restrict : 'E',
		controller : 'SearchController',
		templateUrl : '/templates/search.html',
		scope : {
			items : '=',
			searchUrl : '=',
			searchText : '='
		}
	};
};

exports.efAboutMe = function() {
	return {
		templateUrl : '/templates/about_me.html'
	};
};

exports.efEatwell = function() {
	return {
		templateUrl : '/templates/eatwell.html'
	};
};

exports.efAbout = function() {
	return {
		templateUrl : '/templates/about.html'
	};
};

exports.efHow = function() {
	return {
		templateUrl : '/templates/how.html'
	};
};

exports.efProducts = function() {
	return {
		templateUrl : '/templates/products.html'
	};
};

exports.efTransparencyP = function() {
	return {
		templateUrl : '/templates/transparency_p.html'
	};
};

exports.efThefarmP = function() {
	return {
		templateUrl : '/templates/the_farm_p.html'
	};
};

exports.efTheknowhowP = function() {
	return {
		templateUrl : '/templates/the_know_how_p.html'
	};
};

exports.efBackgroundImg = function() {
	return function(scope, element, attrs) {
		element.css('background', 'url(/images/background.jpg)');
		element.css('background-size', 'cover');
		element.css('background-repeat', 'no-repeat');
	};
};

exports.efMasthead = function() {
	return function(scope, element, attrs) {
		element.css('background', 'url(' + attrs.image + ')');
		element.css('background-size', 'cover');
		element.css('background-repeat', 'no-repeat');
		element.css('background-position', 'center center');
	};
}; 
},{}],6:[function(require,module,exports){
var controllers = require('./controllers/cb-controller');
var papi_controllers = require('./controllers/papi-controller');
var beer_controllers = require('./controllers/beer-controller');
var directives = require('./directives');
var papi_directives = require('./papi-directives');
var beer_directives = require('./beer-directives');
var services = require('./services');
var _ = require('underscore');

var components = angular.module('cb.components', ['ng']);

_.each(controllers, function(controller, name) {
	components.controller(name, controller);
});

_.each(papi_controllers, function(controller, name) {
	components.controller(name, controller);
});

_.each(beer_controllers, function(controller, name) {
	components.controller(name, controller);
});

_.each(directives, function(directive, name) {
	components.directive(name, directive);
});

_.each(papi_directives, function(directive, name) {
	components.directive(name, directive);
});

_.each(beer_directives, function(directive, name) {
	components.directive(name, directive);
});

_.each(services, function(factory, name) {
	components.factory(name, factory);
});

var app = angular.module('craft', ['cb.components', 'ui.router', 'cb.router', 'ngMaterial', 'satellizer', 'ngFileUpload','html5DragDrop']);

app.config(function($mdThemingProvider) {
	var tomatoMap = $mdThemingProvider.extendPalette('red', {
		'500' : '#CF3721'
	});
	var cherryMap = $mdThemingProvider.extendPalette('red', {
		'500' : '#D72C16',
		'600' : '#80C614'
	});
	var avocadoMap = $mdThemingProvider.extendPalette('green', {
		'500' : '#258039'
	});
	var letuceMap = $mdThemingProvider.extendPalette('green', {
		'500' : '#C7DB00'
	});
	var aquaBlueMap = $mdThemingProvider.extendPalette('cyan', {
		'500' : '#67BACA'
	});
	var offWhiteMap = $mdThemingProvider.extendPalette('grey', {
		'50' : '#FCFDFE',
		'100' : '#FDF6F6',
		'200' : '#F0EFEA'
	});
	var yellowPepperMap = $mdThemingProvider.extendPalette('yellow', {
		'500' : '#F5BE41'
	});

	$mdThemingProvider.definePalette('tomato', tomatoMap);
	$mdThemingProvider.definePalette('avocado', avocadoMap);
	$mdThemingProvider.definePalette('aquaBlue', aquaBlueMap);
	$mdThemingProvider.definePalette('offWhite', offWhiteMap);
	$mdThemingProvider.definePalette('cherry', cherryMap);
	$mdThemingProvider.definePalette('letuce', letuceMap);
	$mdThemingProvider.definePalette('yelloPepper', yellowPepperMap);
	//$mdThemingProvider.theme('default').primaryPalette('pink').accentPalette('blue').warnPalette('indigo').backgroundPalette('blue-grey');
	$mdThemingProvider.theme('default').primaryPalette('cherry').accentPalette('aquaBlue', {
		'default' : '500'
	}).warnPalette('offWhite', {
		'default' : '100'
	}).backgroundPalette('offWhite');
});

app.config(function($authProvider) {
	$authProvider.facebook({
		clientId : '830021813794855',
		scope : ['email', 'pages_show_list']
	});
});

app.constant('cbConfig', {
	'papi_url' : '/papi/v1',
	'beer_url' : '/beer/v1',
	'iapi_url' : '/iapi/v1'
});

app.run(['$state', '$rootScope', '$window', '$mdMedia', '$mdDialog', '$auth',
function($state, $rootScope, $window, $mdMedia, $mdDialog, $auth) {

	$rootScope.data = {
		isSignedin : false
	};

	if ($auth.isAuthenticated()) {
		$rootScope.data.isSignedin = true;
	};
}]);

var router = angular.module('cb.router', []);

router.config(function($locationProvider) {
	$locationProvider.html5Mode({
		enabled : true,
		requireBase : false
	});
});

router.config(['$urlRouterProvider',
function($urlRouterProvider) {

	$urlRouterProvider.otherwise("/");

}]);

router.config(['$stateProvider',
function($stateProvider) {

	$stateProvider.state('home', {
		url : '/',
		views : {
			'' : {
				controller : 'BeerController',
				templateUrl : '/templates/beers.html',
			},
		},
	}).state('signup', {
		url : '/signup',
		views : {
			'' : {
				controller : 'SignupController',
				templateUrl : '/templates/signup.html',
			},
		},
	}).state('producers', {
		url : '/producers',
		views : {
			'' : {
				controller : 'EpicdataController',
				templateUrl : '/templates/transparency.html',
			},
		},
	}).state('logout', {
		url : '/logout',
		template : null,
		controller : 'LogoutController'
	}).state('login', {
		url : '/login',
		views : {
			'' : {
				controller : 'LoginController',
				templateUrl : '/templates/login.html',
			},
		},
	}).state('produces', {
		url : '/produces',
		views : {
			'' : {
				controller : 'ProducesController',
				templateUrl : '/templates/produces.html',
			},
		},
	}).state('beers', {
		url : '/beer',
		views : {
			'' : {
				controller : 'BeerController',
				templateUrl : '/templates/beers.html',
			},
		},
	}).state('beer', {
		url : '/beer/:name',
		views : {
			'' : {
				controller : 'BeerPageController',
				templateUrl : '/templates/beer_page.html',
			},
		},
	});

	function skipIfLoggedIn($q, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.reject();
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}

	function loginRequired($q, $location, $auth) {
		var deferred = $q.defer();
		if ($auth.isAuthenticated()) {
			deferred.resolve();
		} else {
			$location.path('/');
		}
		return deferred.promise;
	}

}]);


},{"./beer-directives":1,"./controllers/beer-controller":2,"./controllers/cb-controller":3,"./controllers/papi-controller":4,"./directives":5,"./papi-directives":7,"./services":8,"underscore":9}],7:[function(require,module,exports){
exports.papiProduceCard = function() {
  return {
  	controller: 'ProduceCardController',
    templateUrl: 'templates/produce_card.html'
  };
};

},{}],8:[function(require,module,exports){
exports.facebookApiService = function($http, $q, $log) {

	var service = {};
	service.base_url = 'https://graph.facebook.com';
	service.version = 'v2.6';

	service.getMe = function(name, params, method, token) {
		var url = service.base_url + '/' + service.version + '/' + 'me';
		var access_token = {
			'access_token' : token,
			'fields' : 'email,id,name'
		};
		return http = $http({
			url : url,
			method : method,
			params : access_token,
			data : access_token
		});
	};

	return service;
};

exports.accountService = function($http) {
	return {
		getProfile : function() {
			return $http.get('/api/v1/me');
		},
		updateProfile : function(profileData) {
			return $http.put('/api/v1/me', profileData);
		}
	};
};

exports.efSelectService = function($anchorScroll, $location) {
	var service = {
		selected_item : {
			opacity : 1
		}
	};
	$location.hash('dropzone');

	service.select = function(recipe, style) {
		service.selected_item.opacity = 1;
		service.selected_item = recipe;
		service.selected_item.opacity = 0.2;
		service.drop_button_class = style;
		$anchorScroll();
	};

	service.drop = function() {
		var selected_item = service.selected_item;
		service.selected_item.opacity = 1;
		service.drop_button_class = null;
		return selected_item;
		;
	};

	return service;

};

},{}],9:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}]},{},[6]);
