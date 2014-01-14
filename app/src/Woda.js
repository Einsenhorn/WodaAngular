angular.module('Woda', [
  'ngRoute',

  'AdminModule',
  'FileModule',
  'LayoutModule',
  'SearchModule',
  'UserModule',
  'ui.bootstrap',
])
.config(['$routeProvider', function($routeProvider) {
  var isLoginRoute = function(route) {
    return route.hasOwnProperty("$$route") && route.$$route.originalPath.indexOf("login") >= 0;
  };

  var isValidRoute = function(route) {
    return route.hasOwnProperty("$$route") && route.$$route.hasOwnProperty("_access_");
  };

  var isAnonAccessAllowed = function(route) {
    return (isValidRoute(route)
            && route.$$route._access_.hasOwnProperty("_anonAllowed_")
            && route.$$route._access_._anonAllowed_);
  };

  var isUserAccessAllowed = function(route) {
    return (isValidRoute(route)
            && route.$$route._access_.hasOwnProperty("_userAllowed_")
            && route.$$route._access_._userAllowed_);
  };

  var resolve = {
    "UserLoading": function($q, $rootScope, $route, $location, User) {
      if (User.isLogged())
        return ;

      var deferred = $q.defer();
      User.r.read(function(data) {
        User.data = data.user;
        $rootScope.User = User.data;
        User.r.getFriends(function(data) {
          User.friends = data.friends;

          if (!isUserAccessAllowed($route.current))
            $location.path("/");
          deferred.resolve(data);
        });
      }, function() {
        if (!isAnonAccessAllowed($route.current) && !isLoginRoute($route.current)) {
          $location.path("/login");
          deferred.reject();
        }

        deferred.resolve();
      });

      return deferred.promise;
    }
  }

  $routeProvider.
    otherwise({
      redirectTo: "/login",
      resolve: resolve
    });
}])
.config(['$compileProvider', function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
}])
.directive('file', function() {
     return {
        restrict: 'E',
         template: '<input type="file" />',
         replace: true,
         require: 'ngModel',
         link: function(scope, element, attr, ctrl) {
             var listener = function() {
                 scope.$apply(function() {
                     attr.multiple ? ctrl.$setViewValue(element[0].files) : ctrl.$setViewValue(element[0].files[0]);
                 });
             };
             element.bind('change', listener);
         }
     };
})
.controller('uploadTest', function($scope, FileTransfer) {
  $scope.$watch( 'foo', function ( ) {
    FileTransfer.upload( $scope.foo, $scope.upload = { } );
  } );
})
.run(['$q', '$location', '$rootScope', '$route', 'User', function($q, $location, $rootScope, $route, User) {
  $rootScope.title = 'Woda';
  $rootScope.User = {};

  var isLoginRoute = function(route) {
    return route.hasOwnProperty("$$route") && route.$$route.originalPath.indexOf("login") >= 0;
  };

  var isValidRoute = function(route) {
    return route.hasOwnProperty("$$route") && route.$$route.hasOwnProperty("_access_");
  };

  var isAnonAccessAllowed = function(route) {
    return (isValidRoute(route)
            && route.$$route._access_.hasOwnProperty("_anonAllowed_")
            && route.$$route._access_._anonAllowed_);
  };

  var isUserAccessAllowed = function(route) {
    return (isValidRoute(route)
            && route.$$route._access_.hasOwnProperty("_userAllowed_")
            && route.$$route._access_._userAllowed_);
  };

  $rootScope.$on("$routeChangeStart", function(event, next, current) {
    if (current) {
      if (User.isLogged()) {
        if (!isUserAccessAllowed(next)) {
          $location.path("/");
        }
      } else {
        if (!isAnonAccessAllowed(next) && !isLoginRoute(next)) {
          $location.path("/login");
        }
      }
    }
  });
}]);
