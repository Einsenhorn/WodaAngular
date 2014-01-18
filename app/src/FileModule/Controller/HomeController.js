angular.module('FileModule').controller('HomeController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', function($scope, $rootScope, $routeParams, $location, FSystem) {
	$scope.root = {};

	FSystem.r.getList({ FSystemId: $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : '' }, function(data) {
			if (!data.hasOwnProperty("folder")) {
				$location.path('/');
				return ;
			}

			$scope.root = data.folder;
			$rootScope.title = $scope.root.name;
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
		}
	);
}]);