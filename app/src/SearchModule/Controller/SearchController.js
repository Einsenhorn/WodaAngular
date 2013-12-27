angular.module('SearchModule').controller('SearchController', ['$scope', '$location', '$routeParams', 'Search', function($scope, $location, $routeParams, Search) {
	$scope.query = 'louis';
	$scope.filter = 'users';

	if ($routeParams.hasOwnProperty("query")) {
		Search.r.request({ name: $routeParams.query }, function(data) {
				$scope.resultUsers = data.users;
				$scope.resultUsersCount = data.users.length;

				$scope.resultPrivateFiles = data.private_files;
				$scope.resultPrivateFilesCount = data.private_files.length;

				$scope.resultPublicFiles = data.public_files;
				$scope.resultPublicFilesCount = data.public_files.length;

			}, function(httpResponse) {
				console.debug(httpResponse);
		});
	}

	$scope.search = function(query) {
		if (query)
			$location.path("/search/" + query);
	};
}]);
