angular.module('SearchModule', [
	'ngResource'
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
    when("/search/:query", {
      controller: "SearchController",
      templateUrl: "app/src/SearchModule/Views/result.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    });
}]);

