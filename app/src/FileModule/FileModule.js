angular.module('FileModule', [
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
  when("/", {
      controller: "ListController",
      templateUrl: "app/src/FileModule/Views/list.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/list", {
      redirectTo: "/"
    }).
    when("/list/:FSystemId", {
      controller: "ListController",
      templateUrl: "app/src/FileModule/Views/list.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/recent", {
      controller: "RecentController",
      templateUrl: "app/src/FileModule/Views/recent.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/favorite", {
      controller: "FavoriteController",
      templateUrl: "app/src/FileModule/Views/favorite.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/public", {
      controller: "PublicController",
      templateUrl: "app/src/FileModule/Views/public.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/downloaded", {
      controller: "DownloadedController",
      templateUrl: "app/src/FileModule/Views/downloaded.html",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    });
}]);