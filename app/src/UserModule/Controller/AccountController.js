angular.module('UserModule').controller('AccountController', ['$scope', '$rootScope', '$location', 'User', function($scope, $rootScope, $location, User) {
	$rootScope.title = 'Woda';
	$scope.errorMessage = "";

	$scope.register = function(user, email, password) {
		User.r.create({ user: user }, { email: email, password: password }, function(data) {
				User.data = data.user;
                $rootScope.User = User.data;
				$location.path('/');
			}, function(httpResponse) {
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};

	$scope.update = function(email, password) {
		User.r.update({}, { email: email, password: password }, function(data) {
				User.data = data.user;
				$scope.successMessage = "success !";
			}, function(httpResponse) {
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};

	$scope.delete = function() {
		User.r.delete(function(data) {
				User.data = {};
                $rootScope.User = {};
				$location.path("/login");
			}
		);

	};

	$scope.login = function(user, password) {
		User.r.login({ user: user }, { password: password }, function(data) {
				User.data = data.user;
                $rootScope.User = User.data;
				User.r.getFriends(function(data) {
					User.friends = data.friends;
					$location.path("/");
				})
			}, function (httpResponse) {
				if (httpResponse.status == 400) {
					$scope.errorMessage = httpResponse.data.message;
				}
			}
		);
	};
}]);