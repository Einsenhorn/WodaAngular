angular.module('LayoutModule')
.controller('CreateFolderModalController', function ($scope, $modalInstance, FSystem, $rootScope){

	$scope.createFolder = function(foldername) {
		//fonctionne a moitie / voir avec kevin comme creer un repertoire ailleur qu'a la racine
		FSystem.r.createFolder({}, { filename: foldername }, function(data) {
			
			$rootScope.$emit('FSystem.fileAdd', data.folder);
			$modalInstance.close();
		})
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

})
.controller('HeaderController', ['$scope', '$rootScope', 'User', '$location', '$modal', '$routeParams', function($scope, $rootScope, User, $location, $modal, $routeParams) {

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
		return 'home';
	}

	$rootScope.$on("$locationChangeSuccess", function (event, next, current) {
		// angular.element('.active').removeClass('active');
		// angular.element('a[href="#'+ $location.path() +'"]').addClass('active');
		$scope.currentPage = getCurrentPage($location.path());

		console.log($scope.currentPage);
		console.log($location.path());

	});


	$scope.openCreateFolderModal = function () {
    	var modalInstance = $modal.open({
		templateUrl: 'app/src/LayoutModule/Views/CreateFolderModal.html',
		controller: 'CreateFolderModalController',
		resolve: {
			items: function () {
				return $scope.items;
			}
		}
    });

    modalInstance.result.then(function (selectedItem) {
    	$scope.selected = selectedItem;
    }, function () {
    	// $log.info('Modal dismissed at: ' + new Date());
    });
  };

}])
;