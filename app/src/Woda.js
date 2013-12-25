angular.module('Woda', [
  'ngRoute',

  'FileModule',
  'LayoutModule',
  'SearchModule',
  'UserModule',
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

        if (!isUserAccessAllowed($route.current))
          $location.path("/");
        deferred.resolve(data);
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
    when("/login", {
      templateUrl: "app/src/UserModule/Views/Security/login.html",
      controller: "AccountController",
      _access_: {
        _anonAllowed_: true
      },
      resolve: resolve
    }).
    when("/register", {
      templateUrl: "app/src/UserModule/Views/Account/register.html",
      controller: "AccountController",
      _access_: {
        _anonAllowed_: true
      },
      resolve: resolve
    }).
    when("/account", {
      templateUrl: "app/src/UserModule/Views/Account/account.html",
      controller: "AccountController",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/profile", {
      templateUrl: "app/src/UserModule/Views/Account/profile.html",
      controller: "AccountController",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/search/:query", {
      templateUrl: "app/src/SearchModule/Views/result.html",
      controller: "SearchController",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/:FSystemId", {
      templateUrl: "app/src/FileModule/Views/list.html",
      controller: "ListController",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    when("/", {
      templateUrl: "app/src/FileModule/Views/list.html",
      controller: "ListController",
      _access_: {
        _userAllowed_: true
      },
      resolve: resolve
    }).
    otherwise({
      redirectTo: "/login",
      resolve: resolve
    });
}])
.config(['$compileProvider', function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image\//);
}])
.run(['$q', '$location', '$rootScope', '$route', 'User', 'FSystem', function($q, $location, $rootScope, $route, User, FSystem) {
  $rootScope.title = 'Woda';

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