angular.module('UserModule').directive('userLogout', ['$location', 'User', function($location, User) {
	return {
		link: function(scope, element, attrs) {
			element.bind("click", function() {
				User.r.logout({}, function(data) {
					User.data = {};
					$location.path("/login");				
				});
			});
		}
	};
}]);