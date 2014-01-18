angular.module('LayoutModule')
.controller('CreateFolderModalController', ['$scope', '$modalInstance', 'FSystem', '$rootScope', function ($scope, $modalInstance, FSystem, $rootScope){

	$scope.breadcrumb = $rootScope.breadcrumb;

    if ($scope.breadcrumb.substr(0, 2) == '//') {
        $scope.breadcrumb = $scope.breadcrumb.substr(1);
    }

	$scope.createFolder = function(foldername) {
		FSystem.r.createFolder({}, { filename: $scope.breadcrumb + foldername }, function(data) {
			$rootScope.$emit('FSystem.fileAdd', data.folder);
			$modalInstance.close();
		})
	}

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}])
.controller('UploadModalController', ['$modalInstance', '$scope', 'FileTransfer', '$rootScope', function ($modalInstance, $scope, FileTransfer, $rootScope){

	$scope.files = FileTransfer.files;
	$scope.path = $rootScope.breadcrumb.substr(1);

	$scope.startUpload = function(file) {
		var progress = {};

		transfer = FileTransfer.upload(file, progress);

		if (file)
			FileTransfer.files.push(progress);

		transfer.then(function(data){
			$rootScope.$emit('FSystem.fileAdd', progress.model);
		})
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);