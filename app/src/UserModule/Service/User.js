angular.module('UserModule').factory('User', ['$http', '$resource', 'WodaConfiguration', function($http, $resource, WodaConfiguration) {
	var headers = { 'Content-Type': 'application/json' };

	return {
			data: {},
			promise: $http.get(WodaConfiguration.host + "/users", { withCredentials: true }),
			r: $resource(WodaConfiguration.host + '/users', {}, {
				login: {
					url: WodaConfiguration.host + '/users/:user/login',
					method:'POST',
					withCredentials: true,
					headers: headers
				}, logout: {
					url: WodaConfiguration.host + '/users/logout',
					method:'GET',
					withCredentials: true,
					headers: headers
				}, read: {
					url: WodaConfiguration.host + '/users',
					method:'GET',
					withCredentials: true,
					headers: headers
				}, update: {
					url: WodaConfiguration.host + '/users',
					method: 'POST',
					withCredentials: true,
					headers: headers
				}, create: {
					url: WodaConfiguration.host + '/users/:user',
					method: 'PUT',
					withCredentials: true,
					headers: headers
				}, delete: {
					url: WodaConfiguration.host + '/users',
					method: 'DELETE',
					withCredentials: true,
					headers: headers
				}
			}),
			isLogged: function() {
				return !(Object.keys(this.data).length === 0);
			}
	};
}]);
