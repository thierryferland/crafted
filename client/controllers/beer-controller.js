exports.BeerCardController = function($scope, $http, $attrs, cbConfig, efSelectService) {

	$scope.save = function($index, id) {
		data = {
			name : $scope.beers[$index].name,
			image : $scope.beers[$index].image
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

