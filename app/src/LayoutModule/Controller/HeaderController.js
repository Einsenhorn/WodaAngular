angular.module('LayoutModule')
.controller('HeaderController', ['$scope', '$rootScope', 'User', '$location', '$modal', 'User', function($scope, $rootScope, User, $location, $modal, User) {
    $scope.show = false;

    $rootScope.$watch("User", function (event, next, current) {
        $scope.show = User.isLogged() ? true : false;
    });

    $scope.currentPage = getCurrentPage($location.path());

	function getCurrentPage(path) {
		if (path.indexOf('recent') != -1)
			return 'recent';
		if (path.indexOf('favorite') != -1)
			return 'favorite';
		if (path.indexOf('public') != -1)
			return 'public';
		if (path.indexOf('downloaded') != -1)
			return 'downloaded';
		if (path.indexOf('friends') != -1)
			return 'friends';
        if (path.indexOf('admin') != -1)
            return 'admin';
		return 'home';
	}

	$rootScope.$on("$locationChangeSuccess", function (event, next, current) {
		// angular.element('.active').removeClass('active');
		// angular.element('a[href="#'+ $location.path() +'"]').addClass('active');
		$scope.currentPage = getCurrentPage($location.path());
	});


	$scope.openCreateFolderModal = function () {
    	var modalInstance = $modal.open({
			templateUrl: 'app/src/LayoutModule/Views/CreateFolderModal.html',
			controller: 'CreateFolderModalController'
    	});

	    modalInstance.result.then(function () {
	    	//validated
	    }, function () {
	    	// $log.info('Modal dismissed at: ' + new Date());
	    });
	};

    $scope.openUploadModal = function () {
    	var modalInstance = $modal.open({
			templateUrl: 'app/src/LayoutModule/Views/UploadModal.html',
			controller: 'UploadModalController'
    	});

	    modalInstance.result.then(function () {
	    	// validated
	    }, function () {
	    	// $log.info('Modal dismissed at: ' + new Date());
	    });
	};


}]);