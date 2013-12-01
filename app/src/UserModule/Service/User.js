angular.module('UserModule').factory('User', ['$resource', 'ServiceURL', function($resource, ServiceURL) {
	var headers = { 'Content-Type': 'application/json' };

	return {
		data: {},
		r: $resource(ServiceURL + '/users', {}, {
			login: {
				url: ServiceURL + '/users/:user/login',
				method:'POST',
				withCredentials: true,
				headers: headers
			}, logout: {
				url: ServiceURL + '/users/logout',
				method:'GET',
				withCredentials: true,
				headers: headers
			}, read: {
				url: ServiceURL + '/users',
				method:'GET',
				withCredentials: true,
				headers: headers
			}, update: {
				url: ServiceURL + '/users',
				method: 'POST',
				withCredentials: true,
				headers: headers
			}, create: {
				url: ServiceURL + '/users/:user',
				method: 'PUT',
				withCredentials: true,
				headers: {
					'Content-Type': 'application/json',
					'X-Requested-With': '',
				}
			}, delete: {
				url: ServiceURL + '/users',
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
