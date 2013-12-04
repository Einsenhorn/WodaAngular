/**
 *
 * [-----------]
 * Route Access
 * _access_: {
 *  _anonAllowed: true|false [dft -> false]
 *  _userAllowed: true|false [fft -> true]
 * }
 * [-----------]
 *
 */
angular.module('Woda', [
  'ngRoute',
  'woda.user',
  'woda.file',
  'woda.configuration'
])
// Temporary
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
.controller('uploadTest', function($scope, WodaFileTransfer) {
    $scope.$watch( 'foo', function ( ) {
        WodaFileTransfer.upload( $scope.foo );
    } );
})
.config(function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'app/src/User/Views/Security/login.html',
        controller: 'AccountController',
        _access_: {
          _anonAllowed_: true,
          _userAllowed_: false
        }
      }).
      when('/register', {
        templateUrl: 'app/src/User/Views/Account/register.html',
        controller: 'AccountController',
        _access_: {
          _anonAllowed_: true,
          _userAllowed_: false
        }
      }).
      when('/account', {
        templateUrl: 'app/src/User/Views/Account/account.html',
        controller: 'AccountController',
        _access_: {
          _anonAllowed_: false,
          _userAllowed_: true
        }
      }).
      when('/profile', {
        templateUrl: 'app/src/User/Views/Account/profile.html',
        controller: 'AccountController',
        _access_: {
          _anonAllowed_: false,
          _userAllowed_: true
        }
      }).
      when('/', {
          templateUrl: 'app/src/File/Views/list.html'
      }).
      otherwise({
        redirectTo: '/'
      });
}).
constant('ServiceURL', 'http://kobhqlt.fr:3000').
constant('version', '0.1')
    .run(function($location, $rootScope, $route, WodaUser) {

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

        var checkRoute = function() {
            $rootScope.$on("$routeChangeStart", function(event, next, current) {
                if (WodaUser.isLogged()) {
                    if (!isUserAccessAllowed(next)) {
                        $location.path("/");
                    }
                } else {
                    if (!isAnonAccessAllowed(next) && next.templateUrl != "app/src/UserModule/Views/login.html") {
                        $location.path("/login");
                    }
                }
            });
        };

        WodaUser.r.read(function (data) {
            console.log('User already connected');
            WodaUser.data = data.user;
            checkRoute();
            if (!isUserAccessAllowed($route.current)) {
                $location.path("/");
            }
        }, function(data) {
            console.log('User not connected yet');
            checkRoute();
            if (!isAnonAccessAllowed($route.current)) {
                $location.path("/login");
            }
        });
    });