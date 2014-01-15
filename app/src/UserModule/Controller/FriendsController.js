angular.module('UserModule').controller('FriendsController', ['$scope', 'User', function($scope, User) {
	User.r.getFriends(function(data) {
	        User.friends = data.friends;
		    $scope.friends = User.friends;
		}
	);
}]);
