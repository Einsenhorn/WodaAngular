angular.module('UserModule').controller('AccountController', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {
	$scope.User = User.data;
	$scope.errorMessage = "";

	/* --- */
	$scope.user = 'louis';
	$scope.password = 'azerty';
	/* --- */

	$scope.register = function(user, email, password) {
		console.debug('User registering', user, email, password);

		User.r.create({ user: user }, { email: email, password: password }, function(data) {
				console.debug('User registered and logged !');
				User.data = data.user;
				$location.path('/');
			}, function(httpResponse) {
				console.debug('Error during registring')
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};

	$scope.update = function(email, password) {
		User.r.update({}, { email: email, password: password }, function(data) {
				console.debug('User data updated !');
				User.data = data.user;
				$scope.successMessage = "success !";
			}, function(httpResponse) {
				console.debug('Error during update information')
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};

	$scope.delete = function() {
		User.r.delete({}, {}, function(data) {
				User.data = {};
				$location.path("/login");
			}, function() {

			}
		);

	};

	$scope.login = function(user, password) {
		User.r.login({ user: user }, { password: password }, function(data) {
				console.log('User logged');
				User.data = data.user;
				$location.path("/");
			}, function (httpResponse) {
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};
}]);