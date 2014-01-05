angular.module('SearchModule').factory('Search', ['$resource', 'WodaConfiguration', function($resource, WodaConfiguration) {
	var headers = { 'Content-Type': 'application/json' };

	return {
		r: $resource(WodaConfiguration.host + '/search', {}, {
			request: {
				url: WodaConfiguration.host + '/search',
				method:'GET',
				withCredentials: true,
				headers: headers
			}
		})
	};
}]);
