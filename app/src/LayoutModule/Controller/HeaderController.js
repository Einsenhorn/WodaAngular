angular.module('LayoutModule')
.controller('HeaderController', ['$scope', '$rootScope', 'User', '$location', '$modal', 'User', 'FileTransfer', function($scope, $rootScope, User, $location, $modal, User, FileTransfer) {
    $scope.show = false;

    $rootScope.$watch("User", function (event, next, current) {
        $scope.show = User.isLogged();
        FileTransfer.files = [];
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
        if (path.indexOf('sharedToMe') != -1)
        	return 'sharedToMe';
		return 'home';
	}

	$rootScope.$on("$locationChangeSuccess", function (event, next, current) {
		// angular.element('.active').removeClass('active');
		// angular.element('a[href="#'+ $location.path() +'"]').addClass('active');
		$scope.currentPage = getCurrentPage($location.path());
		$rootScope.breadcrumb = '//';
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


}])
.filter('Bytes', function() {
	return function(bytes, precision) {
		if (bytes == 0) return '0';
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0';
		if (typeof precision == 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});;