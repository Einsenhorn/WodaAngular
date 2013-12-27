angular.module('UserModule').controller('ProfileController', ['$scope', '$routeParams', 'User', function($scope, $routeParams, User) {
	if ($routeParams.hasOwnProperty("login")) {
		$scope.user = {
			login: 'toto'
		}
	} else {
		$scope.user = User.data;
	}
}]);
