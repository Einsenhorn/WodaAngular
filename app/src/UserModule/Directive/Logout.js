angular.module('UserModule').directive('userLogout', ['$location', '$rootScope', 'User', function($location, $rootScope, User) {
	return {
		link: function(scope, element) {
			element.bind("click", function() {
				User.r.logout(function() {
					User.data = {};
                    $rootScope.User = {};
					$location.path("/login");				
				});
			});
		}
	};
}]);