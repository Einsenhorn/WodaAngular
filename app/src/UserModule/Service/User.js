angular.module('UserModule').factory('User', ['$resource', 'ServiceURL', function($resource, ServiceURL) {
	var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

	return {
		data: {},
		r: $resource(ServiceURL + '/users', {}, {
			login: {
				url: ServiceURL + '/users/:user/login',
				method:'POST',
				params: {
					user: '@user',
					password: '@password'
				},
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
				params: {
					password: '@password',
					email: '@email'
				},
				headers: headers
			}, create: {
				url: ServiceURL + '/users/:user',
				method: 'PUT',
				withCredentials: true,
				params: {
					password: '@password',
					email: '@email'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'X-Requested-With': '',
					//'Access-Control-Request-Headers': 'X-Custom-Header'
					//'Connection': 'keep-alive'
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
