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

