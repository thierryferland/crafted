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
