angular.module( 'woda.user.model', [ 'ngResource', 'woda.configuration' ] )

    .factory( 'WodaUser', function($resource, WodaParameters ) {
	var headers = { 'Content-Type': 'application/json' };

	return {
	    data: {},
	    r: $resource(WodaParameters.host + '/users', {}, {
		login: {
		    url: WodaParameters.host + '/users/:user/login',
		    method:'POST',
		    withCredentials: true,
		    headers: headers
		}, logout: {
		    url: WodaParameters.host + '/users/logout',
		    method:'GET',
		    withCredentials: true,
		    headers: headers
		}, read: {
		    url: WodaParameters.host + '/users',
		    method:'GET',
		    withCredentials: true,
		    headers: headers
		}, update: {
		    url: WodaParameters.host + '/users',
		    method: 'POST',
		    withCredentials: true,
		    headers: headers
		}, create: {
		    url: WodaParameters.host + '/users/:user',
		    method: 'PUT',
		    withCredentials: true,
		    headers: {
			'Content-Type': 'application/json',
			'X-Requested-With': ''
		    }
		}, delete: {
		    url: WodaParameters.host + '/users',
		    method: 'DELETE',
		    withCredentials: true,
		    headers: headers
		}
	    }),
	    isLogged: function() {
		return !(Object.keys(this.data).length === 0);
	    }
	};
    });
