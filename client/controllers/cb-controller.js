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

exports.PhotoUploadController = function($scope, $http, Upload) {

	//$scope.getPicture()
	$scope.upload = function(file, description) {
		Upload.upload({
			url : '/api/v1/upload/image',
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
