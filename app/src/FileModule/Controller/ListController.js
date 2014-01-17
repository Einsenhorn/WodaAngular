angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', 'FSystem', '$modal', function($scope, $rootScope, FSystem, $modal) {

	$scope.$watch('$scope.root.isPublic', function() {
		console.log('hey');

		if (!$scope.root.isPublic || typeof $scope.root.isPublic == 'undefined')
		{
				$scope.root.isPublic = false;
		}
		else
		{
			$scope.root.isPublic = true;
		}
		console.log($scope.root.isPublic);

		$rootScope.$on('FSystem.fileAdd', function (event, file) {
			if (file.folder)
				$scope.root.folders.push(file);
			else
				$scope.root.files.push(file);
		});
	});
	

	$scope.publicFSystem = function(fsystem) {
		console.log(fsystem);
		FSystem.r.public({ FSystemId: fsystem.id }, { public: (fsystem.public) ? 'false' : 'true' }, function(data) {
			if (fsystem.hasOwnProperty("folder") && fsystem.folder === true) {
				$scope.root.folders[$scope.root.folders.indexOf(fsystem)] = data.file;
			} else {
				$scope.root.files[$scope.root.files.indexOf(fsystem)] = data.file;
			}
		});
	}

	$scope.favoriteFSystem = function(fsystem) {
		FSystem.r.favorite({ FSystemId: fsystem.id }, { favorite: (fsystem.favorite) ? 'false' : 'true' }, function(data) {
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

	$scope.openSyncFileModal = function (file) {
    	var modalInstance = $modal.open({
			templateUrl: 'app/src/FileModule/Views/modal/SyncFileModal.html',
			controller: 'SyncFileModalController',
			resolve: {
				file: function() {
					return file;
				}
			}
    	});
	};

	$scope.openGetDDLinkModal = function (fsystem) {
        FSystem.r.getDDL({ FSystemId: fsystem.id }, function(data) {
            $modal.open({
                templateUrl: 'app/src/FileModule/Views/modal/getDDLink.html',
                controller: 'getDDLinkModalController',
                resolve: { 'link': function() { return data.link } }
            });
        });

    };

    $scope.openShareFSystemModal = function (fsystem) {
        $modal.open({
            templateUrl: 'app/src/FileModule/Views/modal/shareFSystem.html',
            controller: 'shareFSystemController',
            resolve: { 'file': function() { return fsystem; } }
        });
    };
}])
.controller('SyncFileModalController', ['$modalInstance', '$scope', 'FSystem', 'file', function ($modalInstance, $scope, FSystem, file){

	console.log(file);
	$scope.file = file;

	$scope.syncFile = function(file, isLink) {
		FSystem.r.syncPublic({ FSystemId: file.id }, { link: isLink }, function(data) {
			console.log('YEY SYNCD', data);
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}])
.controller('getDDLinkModalController', ['$modalInstance', '$scope', 'link', function ($modalInstance, $scope, link){
    $scope.link = link;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
}])
.controller('shareFSystemController', ['$modalInstance', '$scope', 'FSystem', 'file', function ($modalInstance, $scope, FSystem, file){
    $scope.error = '';
    $scope.success = '';
    $scope.file = file;
    $scope.users = '';
    $scope.login = '';

    FSystem.r.shared({ FSystemId: file.id }, { }, function(data) {
        $scope.users = data.users;
    }, function() {
        $scope.error = 'Error';
    })

    $scope.shareFile = function (login) {
    	if (login) {
	        FSystem.r.share({ FSystemId: file.id }, { login: login }, function(data) {
	            $scope.success = 'Success: `' + data.file.name + '` shared to ' + login;
	            $scope.users.push(data.user);
	            setTimeout(function() { $scope.success = ''; $scope.error = ''; $scope.login = ''; }, 3000);
	        }, function(data) {
	            $scope.error = 'Error: ' + data.message;
	        });
    	} else {
    		$scope.error = "You must specify the user login to share this file with him."
    	}
    }

    $scope.unshareFile = function (user) {
        FSystem.r.unshare({ FSystemId: file.id }, { login: user.login }, function(data) {
            $scope.users.slice($scope.users.indexOf(user), 1);
        }, function(data) {
            $scope.error = 'Error: ' + data.message;
        });
    }
    
    // if (login) {
    //         FSystem.r.share({ FSystemId: FSystemID }, { login: login }, function(data) {
    //             $scope.success = 'Success: `' + data.file.name + '` shared';
    //             setTimeout(function() { $modalInstance.dismiss('ok'); }, 2000);
    //         }, function() {
    //             $scope.error = 'Error';
    //         })
    //     } else {
    //         $scope.error = 'login can not be null.';
    //     }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);;