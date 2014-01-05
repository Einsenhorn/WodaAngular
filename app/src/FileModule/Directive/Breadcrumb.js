angular.module('FileModule').directive('fsystemBreadcrumb', ['$routeParams', 'FSystem', function($routeParams, FSystem) {
	return {
		template: '<div id="breadcrumb">FILE: <span></span></div>',
		replace: true,
		controller: function($scope, $element) {
			var span = $element[0];

			FSystem.r.breadcrumb({ FSystemId: $scope.root.id }, function(data) {
				for (var idx = 0, length = data.breadcrumb.length ; idx < length ; ++idx) {
					if (idx	> 1)
						span.innerHTML += ' / ';
					span.innerHTML += '<a ng-href="#/list/' + data.breadcrumb[idx].id + '" href="#/list/' + data.breadcrumb[idx].id + '">' + data.breadcrumb[idx].name + '</a>';
					if (idx	== 0)
						span.innerHTML += '  ';
				}
			});
		}
	};
}]);