angular.module('FileModule').controller('SharedToMeController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', function($scope, $rootScope, $routeParams, $location, FSystem) {
	$scope.root = {};
	$scope.root.files = [];
	$scope.root.folders = [];
	$scope.root.isPublic = true;
	$scope.root.isShared = true;


	FSystem.r.sharedToMe(function(data) {

			angular.forEach(data.files, function(value, key){
				if (value.file.folder)
					$scope.root.folders.push(value.file);
				else
					$scope.root.files.push(value.file);
			});
			$rootScope.title = 'Favorite files List';
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
		}
	);
}]);