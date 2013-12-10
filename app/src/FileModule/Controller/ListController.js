angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', '$routeParams', 'FSystem', function($scope, $rootScope, $routeParams, FSystem) {
	var FSystemId = $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : 0;

	$scope.root = {};

	FSystem.r.get({ FSystemId: FSystemId ? FSystemId : '' }, function(data, httpResponse) {
			$scope.root = data.hasOwnProperty("folder") ? data.folder : data.file;
			$rootScope.title = $scope.root.name;
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
	});
}]);