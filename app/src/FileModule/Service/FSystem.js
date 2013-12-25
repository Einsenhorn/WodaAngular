angular.module('FileModule').factory('FSystem', ['$resource', 'WodaConfiguration', function($resource, WodaConfiguration) {
	var headers = { 'Content-Type': 'application/json' };

	return {
		root: {},
		r: $resource(WodaConfiguration.host + '/files', {}, {
			get: {
				url: WodaConfiguration.host + '/files/:FSystemId',
				method:'GET',
				params: { depth: 0 },
				withCredentials: true,
				headers: headers
			},
			public: {
				url: WodaConfiguration.host + '/files/public/:FSystemId',
				method:'POST',
				withCredentials: true,
				headers: headers
			},
			favorite: {
				url: WodaConfiguration.host + '/files/favorites/:FSystemId',
				method:'POST',
				withCredentials: true,
				headers: headers
			},
			delete: {
				url: WodaConfiguration.host + '/sync/:FSystemId',
				method:'DELETE',
				withCredentials: true,
				headers: headers
			},
			createFolder: {
				url: WodaConfiguration.host + '/create_folder',
				method:'POST',
				withCredentials: true,
				headers: headers
			},
			getDDL: {
				url: WodaConfiguration.host + '/files/link/:FSystemId',
				method:'GET',
				withCredentials: true,
				headers: headers
			},
			breadcrumb: {
				url: WodaConfiguration.host + '/files/breadcrumb/:FSystemId',
				method:'GET',
				withCredentials: true,
				headers: headers
			}
		})
	};
}]);
