angular.module('UserModule').controller('ProfileController', ['$scope', '$routeParams', '$rootScope', 'User', function($scope, $routeParams, $rootScope, User) {
	if ($routeParams.hasOwnProperty("login")) {
		$scope.user = {
			login: 'toto'
		}
	} else {
		$scope.user = User.data;
	}
}]);
