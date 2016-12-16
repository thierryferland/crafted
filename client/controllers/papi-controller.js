exports.ProduceCardController = function($scope, $http, efConfig) {

	$scope.save = function($index, id) {
		if ($scope.produces[$index].image.is_editing && $scope.image) {
			$scope.produces[$index].image = [$scope.image.id];
			$scope.produces[$index].image_url = $scope.image.image_url;
		};
		data = {
			name : $scope.produces[$index].name,
			image : $scope.produces[$index].image
		};
		if (id) {
			url = efConfig.papi_url + '/produce/edit/' + id;
			$http.post(url, data).success(function(data) {
				console.log('Answer sent!');
				$scope.produces[$index].is_editing = false;
				$scope.produces[$index].image.is_editing = false;
			});
		} else {
			$http.post('/papi/v1/produce/add', data).success(function(data) {
				console.log('Answer sent!');
				$scope.produces[$index] = data.produce;
			});
		}
	};

	$scope.edit = function($index) {
		$scope.produces[$index].is_editing = true;
	};

	$scope.editImage = function($index) {
		$scope.produces[$index].image.is_editing = true;
	};

	$scope.delete = function(produce) {
		url = efConfig.papi_url + '/produce/delete/' + produce._id;
		$http.post(url).success(function(resp) {
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

	$http.get(efConfig.papi_url + '/produce').success(function(data) {
		$scope.produces = data.produces;
	});

	$scope.add = function(text) {
		$scope.image = null;
		$scope.produces.push({
			'name' : text,
			'is_editing' : true,
			'image' : {
				'is_editing' : true
			}
		});
	};

};

