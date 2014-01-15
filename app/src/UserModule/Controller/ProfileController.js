angular.module('UserModule').controller('ProfileController', ['$scope', '$routeParams', '$rootScope', 'User', 'FSystem', function($scope, $routeParams, $rootScope, User, FSystem) {
	if ($routeParams.hasOwnProperty("login")) {
        User.r.read({ user: $routeParams.login }, {}, function(data) {
                $scope.user = data.user;

                FSystem.r.getUserPublicList({ user: data.user.id, FSystemId: $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : ''}, function(data) {
                        $scope.root = data.folder;
                    }, function() {

                });
            }, function() {

        });

	} else {
		$scope.user = User.data;

        FSystem.r.getUserPublicList({ user: User.data.id, FSystemId: $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : ''}, function(data) {
                $scope.root = data.folder;
            }, function() {

        });
	}

    $scope.getDDL = function(fsystem) {
        FSystem.r.getDDL({ FSystemId: fsystem.id }, function(data) {
            console.debug(data.link);
            //alert(data.link);
        });
    }
}]);
