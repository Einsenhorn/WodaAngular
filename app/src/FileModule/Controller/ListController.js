angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', '$routeParams', '$location', 'FSystem', 'FileTransfer', function($scope, $rootScope, $routeParams, $location, FSystem, FileTransfer) {
	$scope.root = {};

	$scope.file = {};

	FSystem.r.getList({ FSystemId: $routeParams.hasOwnProperty("FSystemId") ? $routeParams.FSystemId : '' }, function(data) {
			if (!data.hasOwnProperty("folder")) {
				$location.path('/');
				return ;
			}

			$scope.root = data.folder;
			$rootScope.title = $scope.root.name;
		}, function(httpResponse) {
			if (httpResponse.status == 400) {
				$scope.error = httpResponse.data.message;
			}
		}
	);

	$rootScope.$on('FSystem.fileAdd', function (event, file) {
		if (file.folder)
			$scope.root.folders.push(file);
		else
			$scope.root.files.push(file);
	});

	$scope.$watch( 'fichier', function ( ) {
    	FileTransfer.upload( $scope.fichier );
 	} );

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

	$scope.getDDL = function(fsystem) {
		FSystem.r.getDDL({ FSystemId: fsystem.id }, function(data) {
			window.location = data.link;
			console.debug(data.link);
			//alert(data.link);
		});
	}
}]);