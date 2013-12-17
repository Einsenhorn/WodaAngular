angular.module('SearchModule').controller('SearchController', ['$scope', 'Search', function($scope, Search) {
	console.debug('test');

	$scope.request = function(query) {
		//console.debug('-- test --');
		Search.r.request({ name: query }, function(data) {
				$scope.requestUser = data.users;
				$scope.requestPrivateFiles = data.private_files;
				$scope.requestPublicFiles = data.public_files;
			}, function(httpResponse) {
				console.debug(httpResponse);
		});
	};
}]);
