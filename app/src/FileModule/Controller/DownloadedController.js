angular.module('FileModule').controller('DownloadedController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', function($scope, $rootScope, $routeParams, $location, FSystem) {
	$scope.root = {};

	FSystem.r.getDownloaded(function(data) {
			$scope.root.files = data.files;
			$rootScope.title = 'Downloaded files list';
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
		}
	);

	$scope.publicFSystem = function(fsystem) {
		FSystem.r.public({ FSystemId: fsystem.id }, { public: !fsystem.public }, function(data) {
			$scope.root.files[$scope.root.files.indexOf(fsystem)] = data.file;
		});
	}

	$scope.favoriteFSystem = function(fsystem) {
		FSystem.r.favorite({ FSystemId: fsystem.id }, { favorite: !fsystem.favorite }, function(data) {
			$scope.root.files[$scope.root.files.indexOf(fsystem)] = data.file;
		});
	}

	$scope.deleteFSystem = function(fsystem) {
		FSystem.r.delete({ FSystemId: fsystem.id }, function(data) {
			$scope.root.files.splice($scope.root.files.indexOf(fsystem), 1);
		});
	}

	$scope.getDDL = function(fsystem) {
		FSystem.r.getDDL({ FSystemId: fsystem.id }, function(data) {
			window.location = data.link;
			console.debug(data.link);
			//alert(data.link);
		});
	}
}]);