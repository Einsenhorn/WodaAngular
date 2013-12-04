angular.module( 'woda.user.account', [ 'woda.user.model' ] )

    .controller( 'AccountController', function( $scope, $rootScope, $location, WodaUser ) {

	$scope.User = WodaUser.data;
	$scope.errorMessage = "";

	/* --- */
	$scope.user = 'mael';
	$scope.password = 'azertyzef';
	/* --- */

	$scope.register = function(user, email, password) {
	    console.debug('User registering', user, email, password);

	    User.r.create({ user: user }, { email: email, password: password }, function(data) {
		console.debug('User registered and logged !');
		WodaUser.data = data.user;
		$location.path('/');
	    }, function(httpResponse) {
		console.debug('Error during registring');
		if (httpResponse.status == 400) {
		    $scope.errorMessage = httpResponse.data.message;
		}
	    });
	};

	$scope.update = function(email, password) {
	    WodaUser.r.update({}, { email: email, password: password }, function(data) {
		console.debug('User data updated !');
		WodaUser.data = data.user;
		$scope.successMessage = "success !";
	    }, function(httpResponse) {
		console.debug('Error during update information');
		if (httpResponse.status == 400) {
		    $scope.errorMessage = httpResponse.data.message;
		}
	    });
	};

	$scope.delete = function() {
	    WodaUser.r.delete({}, {}, function(data) {
		WodaUser.data = {};
		$location.path("/login");
1	    }, function() {

	    });
	};

	$scope.login = function(user, password) {
	    WodaUser.r.login({ user: user }, { password: password }, function(data) {
		console.log('User logged');
		WodaUser.data = data.user;
		$location.path("/");
	    }, function (httpResponse) {
		if (httpResponse.status == 400) {
		    $scope.errorMessage = httpResponse.data.message;
		}
	    } );
	};
    });
