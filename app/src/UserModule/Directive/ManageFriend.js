angular.module('UserModule').directive('userManageFriend', ['$compile', '$routeParams', '$route', 'User', function($compile, $routeParams, $route, User) {
	var templateAdd = '<span><a class="btnclassic" ng-click="addFriend(reloadPage)">Add as friend</a></span>',
			templateRemove = '<span><a class="btnclassic" ng-click="deleteFriend(reloadPage)">Remove this friend</a></span>',
			compileManageFriendTemplate = function($compile, $element, $scope, template) {
				$element.html(template);
      	$compile($element.contents())($scope.$new());
			}
	;

	return {
		replace: true,
		transclude: true,
		link: function($scope, $element) {
			var friends = User.friends,
					template = templateAdd
			;

			for (var idx = 0, length = friends.length ; idx < length ; ++idx)
				if (friends[idx].id == $scope.user.id) {
					template = templateRemove;
					break ;
				}

			compileManageFriendTemplate($compile, $element, $scope, template)
        },
		controller: function($scope, $element) {
              $scope.addFriend = function(reload) {
                    User.r.addFriend({ id: $scope.user.id }, {}, function(data) {
                        User.friends.push(data.friend);
                        compileManageFriendTemplate($compile, $element, $scope, templateRemove);

                        if (reload === true)
                            $route.reload();
                    })
              };

              $scope.deleteFriend = function(reload) {
                    User.r.deleteFriend({ id: $scope.user.id }, {}, function() {
                        User.friends.splice(User.friends.indexOf($scope.user), 1);
                        compileManageFriendTemplate($compile, $element, $scope, templateAdd);

                        if (reload === true)
                            $route.reload();
                    })
              };
        }
    };
}]);