angular.module('FileModule').directive('fsystemBreadcrumb', ['$routeParams', 'FSystem', function($routeParams, FSystem) {
	return {
		template: '<div>FILE: <ul class="breadcrumb"></ul></div>',
		replace: true,
		controller: function($scope, $element) {
			var ul = $element.children()[0];

			FSystem.r.breadcrumb({ FSystemId: $scope.root.id }, function(data) {
				for (var idx = 0, length = data.breadcrumb.length ; idx < length ; ++idx) {
					var li = document.createElement('li');

					li.innerHTML = '<a ng-href="#/' + data.breadcrumb[idx].id + '" href="#/' + data.breadcrumb[idx].id + '">' + data.breadcrumb[idx].name + '</a>';
					ul.appendChild(li);
				}
			});
		}
	};
}]);