angular.module( 'woda.user.logout', [ 'woda.user.model' ] )

    .directive('wodaLogout', function($location, WodaUser) {
        return {
	    link: function(scope, element, attrs) {
	        element.bind("click", function() {
		    WodaUser.r.logout({}, function(data) {
		        WodaUser.data = {};
		        $location.path("/login");
		    });
	        });
	    }
        };
    });
