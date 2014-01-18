angular.module('LayoutModule').controller('FooterController', ['$scope', '$rootScope', 'User', function($scope, $rootScope, User) {
    $scope.show = false;

    $rootScope.$watch("User", function () {
        $scope.show = User.isLogged() ? true : false;
    });
}]);