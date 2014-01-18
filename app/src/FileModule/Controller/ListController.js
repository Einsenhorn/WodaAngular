angular.module('FileModule').controller('ListController', ['$scope', '$rootScope', 'FSystem', '$modal', '$location', function($scope, $rootScope, FSystem, $modal, $location) {

	$scope.$watch('$scope.root.isPublic', function() {
		if (!$scope.root.isPublic || typeof $scope.root.isPublic == 'undefined')
		{
				$scope.root.isPublic = false;
		}
		else
		{
			$scope.root.isPublic = true;
		}
	});

    $scope.$watch('$scope.root.isShared', function() {
        if (!$scope.root.isShared || typeof $scope.root.isShared == 'undefined') {
            $scope.root.isShared = false;
        } else {
            $scope.root.isShared = true;
        }
    });

    $scope.showMove = ($location.path() == '/' || $location.path().substr(0, 6) == '/list/');

	$rootScope.$on('FSystem.fileAdd', function (event, file) {
			if (file.folder)
				$scope.root.folders.push(file);
			else
				$scope.root.files.push(file);
		});

	$scope.publicFSystem = function(fsystem) {
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

    $scope.openMoveFSystemModal = function (fsystem) {
        $modal.open({
            templateUrl: 'app/src/FileModule/Views/modal/moveFSystem.html',
            controller: 'moveFSystemController',
            resolve: { 'fsystem': function() { return fsystem; } }
        });
    };
}])
.controller('SyncFileModalController', ['$modalInstance', '$scope', 'FSystem', 'file', function ($modalInstance, $scope, FSystem, file){
	$scope.file = file;

	$scope.syncFile = function(file, isLink) {
		FSystem.r.syncPublic({ FSystemId: file.id }, { link: isLink });
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

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]).
controller('moveFSystemController', ['$modalInstance', '$scope', '$route', 'FSystem', 'fsystem', function ($modalInstance, $scope, $route, FSystem, f) {
    $scope.fsystem = f;
    $scope.root = {};
    $scope.parent = {};
    $scope.cfolder = {};
    $scope.folder = {};

    FSystem.r.getList(function(data) {
        FSystem.r.breadcrumb({ FSystemId: f.id }, function(d) {
            $scope.parent = d.breadcrumb[d.breadcrumb.length - 2];
            $scope.root = data.folder;
            $scope.cfolder = data.folder;
            $scope.folder = data.folder;
        });
    });

    $scope.selectFolder = function (fsystem) {
        FSystem.r.getList({ FSystemId: fsystem ? fsystem.id : '' }, function(data) {
            if (!fsystem) {
                fsystem = $scope.root;
            }

            if ($scope.parent.id == $scope.root.id) {
                FSystem.r.breadcrumb({ FSystemId: f.id }, function(d) {
                    $scope.parent = d.breadcrumb[d.breadcrumb.length - 2];
                    $scope.folder = fsystem;
                    $scope.cfolder = data.folder;
                });
            } else {
                $scope.folder = fsystem;
                $scope.cfolder = data.folder;
            }

        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.moveFSystem = function () {
        if ($scope.parent && $scope.parent.hasOwnProperty('id')) {
            console.debug('move: ' + $scope.parent.name + '/' + f.name + ' into ' + $scope.folder.name);
            FSystem.r.move({ fileId: f.id, sourceId: $scope.parent.id, destinationId: $scope.folder.id }, {}, function() {
                $route.reload();
                $modalInstance.dismiss('ok');
            });
        }
    };
}]).
filter('charlimit', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length >= chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            }else{
                while(input.charAt(input.length-1) == ' '){
                    input = input.substr(0, input.length -1);
                }
            }
            return input + '...';
        }
        return input;
    };
});