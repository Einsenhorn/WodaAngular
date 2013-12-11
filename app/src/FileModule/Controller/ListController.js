angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', '$routeParams', 'FSystem', function($scope, $rootScope, $routeParams, FSystem) {
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

	$scope.publicFile = function(file) {
		FSystem.r.public({ FSystemId: file.id }, { public: !file.public }, function(data) {
			$scope.root.files[$scope.root.files.indexOf(file)] = data.file;
		})
	}

	$scope.favoriteFile = function(file) {
		FSystem.r.favorite({ FSystemId: file.id }, { favorite: !file.favorite }, function(data) {
			$scope.root.files[$scope.root.files.indexOf(file)] = data.file;
		})
	}

	$scope.deleteFSystem = function(fsystem) {
		FSystem.r.delete({ FSystemId: fsystem.id }, function(data) {
			console.debug(fsystem);
			if (fsystem.hasOwnProperty("folder") && fsystem.folder === true) {
				$scope.root.folders.splice($scope.root.folders.indexOf(fsystem), 1);
			} else {
				$scope.root.files.splice($scope.root.files.indexOf(fsystem), 1);
			}
		})
	}

	$scope.createFolder = function(foldername) {
		//fonctionne a moitie / voir avec kevin comme creer un repertoire ailleur qu'a la racine
		FSystem.r.createFolder({}, { filename: foldername }, function(data) {
			$scope.root.folders.push(data.folder);
		})
	}
}]);