angular.module('FileModule').factory('FSystem', ['$resource', 'WodaConfiguration', function($resource, WodaConfiguration) {
	var headers = { 'Content-Type': 'application/json' };

	return {
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
