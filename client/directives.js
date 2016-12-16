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