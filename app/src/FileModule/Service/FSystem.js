angular.module('FileModule').factory('FSystem', ['$resource', 'WodaConfiguration', function($resource, WodaConfiguration) {
	var headers = { 'Content-Type': 'application/json' };

	return {
		test: 42,
		root: {},
		r: $resource(WodaConfiguration.host + '/files', {}, {
			get: {
				url: WodaConfiguration.host + '/files/:FSystemId',
				method:'GET',
				withCredentials: true,
				headers: headers
			}
		})
	};
}]);
