angular.module('SearchModule').controller('SearchController', ['$scope', '$location', '$routeParams', 'Search', function($scope, $location, $routeParams, Search) {
	// $scope.query = 'louis';
	$scope.filter = 'users';

	$scope.root = {};
	$scope.root.files = [];
	$scope.root.folders = [];
	$scope.root.users = [];

	$scope.showusers = false;

	function setUpRootFolder(result) {
		$scope.root.files = [];
		$scope.root.folders = [];
		$scope.root.users = [];
		angular.forEach(result, function(value, key){
			if (value.hasOwnProperty('login'))
				$scope.root.users.push(value);
			else if (value.folder)
				$scope.root.folders.push(value);
			else
				$scope.root.files.push(value);

		});
	}

	if ($routeParams.hasOwnProperty("query")) {
		Search.r.request({ name: $routeParams.query }, function(data) {

			setUpRootFolder(data.private_files);

			$scope.result = {};

			$scope.result.users = data.users;
			$scope.result.usersCount = data.users.length;

			$scope.result.privateFiles = data.private_files;
			$scope.result.privateFilesCount = data.private_files.length;

			$scope.result.publicFiles = data.public_files;
			$scope.result.publicFilesCount = data.public_files.length;

			}, function(httpResponse) {
				console.debug(httpResponse);
		});
	}

	$scope.search = function(query) {
		if (query)
			$location.path("/search/" + query);
	};

	$scope.switchRoot = function(type){
		$scope.showusers = false;
		switch(type)
		{
			case 'private':
				setUpRootFolder($scope.result.privateFiles);
				break;
			case 'public':
				setUpRootFolder($scope.result.publicFiles);
				break
			case 'users':
				$scope.showusers = true;
				setUpRootFolder($scope.result.users);
				break;
		}
	}
}]);
