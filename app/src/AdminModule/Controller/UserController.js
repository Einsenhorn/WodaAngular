angular.module('AdminModule').controller('UserController', ['$scope', '$rootScope', '$routeParams', '$location', 'Admin', function($scope, $rootScope, $routeParams, $location, Admin) {
    $scope.users = [];
    $scope.error = "";
/*
    Admin.r.getUsers(function(data) {
            $scope.users = data.users;
        }, function() {
            $scope.error = "An error has occurred !";
    });
*/
    //mock up
    $scope.users = [{ login: 'toto', space: 4242 }, { login: 'titi', space: 1231232131  }, { login: 'tutu', space: 21  }, { login: 'tata', space: 0  }];
    //mock up

    $scope.deleteUser = function(user, index) {
        Admin.r.deleteUser({ user: user.id }, {}, function() {
                $scope.users.splice(index, 1);
            }, function() {

        });
    };

    $scope.updateUserSpace = function(user) {
        Admin.r.UpdateSpaceUser({ user: user.id, newSpace: user.space });
    };
}]);