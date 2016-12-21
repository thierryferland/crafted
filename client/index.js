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

