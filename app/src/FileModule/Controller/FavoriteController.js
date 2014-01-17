angular.module('FileModule').controller('FavoriteController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', function($scope, $rootScope, $routeParams, $location, FSystem) {
	$scope.root = {};
	$scope.root.files = [];
	$scope.root.folders = [];

	FSystem.r.getFavorite(function(data) {
			angular.forEach(data.files, function(value, key){
				if (value.folder)
					$scope.root.folders.push(value);
				else
					$scope.root.files.push(value);
			});
			$rootScope.title = 'Favorite files List';
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
		}
	);
}]);