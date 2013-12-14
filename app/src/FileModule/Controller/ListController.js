angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', function($scope, $rootScope, $routeParams, $location, FSystem) {
	var FSystemId = $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : 0;

	$scope.root = {};

	FSystem.r.get({ FSystemId: FSystemId ? FSystemId : '' }, function(data, httpResponse) {
			$scope.root = data.hasOwnProperty("folder") ? data.folder : data.file;
			$rootScope.title = $scope.root.name;
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
	});

	$scope.publicFSystem = function(fsystem) {
		FSystem.r.public({ FSystemId: fsystem.id }, { public: !fsystem.public }, function(data) {
			if (fsystem.hasOwnProperty("folder") && fsystem.folder === true) {
				$scope.root.folders[$scope.root.folders.indexOf(fsystem)] = data.file;
			} else {
				$scope.root.files[$scope.root.files.indexOf(fsystem)] = data.file;
			}
		});
	}

	$scope.favoriteFSystem = function(fsystem) {
		FSystem.r.favorite({ FSystemId: fsystem.id }, { favorite: !fsystem.favorite }, function(data) {
			if (fsystem.hasOwnProperty("folder") && fsystem.folder === true) {
				$scope.root.folders[$scope.root.folders.indexOf(fsystem)] = data.file;	
			} else {
				$scope.root.files[$scope.root.files.indexOf(fsystem)] = data.file;	
			}
		});
	}

	$scope.deleteFSystem = function(fsystem) {
		FSystem.r.delete({ FSystemId: fsystem.id }, function(data) {
			if (fsystem.hasOwnProperty("folder") && fsystem.folder === true) {
				$scope.root.folders.splice($scope.root.folders.indexOf(fsystem), 1);
			} else {
				$scope.root.files.splice($scope.root.files.indexOf(fsystem), 1);
			}
		});
	}

	$scope.createFolder = function(foldername) {
		//fonctionne a moitie / voir avec kevin comme creer un repertoire ailleur qu'a la racine
		FSystem.r.createFolder({}, { filename: foldername }, function(data) {
			$scope.root.folders.push(data.folder);
		})
	}

	$scope.getDDL = function(fsystem) {
		FSystem.r.getDDL({ FSystemId: fsystem.id }, function(data) {
			window.location = data.link;
			console.debug(data.link);
			//alert(data.link);
		});
	}
}]);