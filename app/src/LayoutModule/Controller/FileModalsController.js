angular.module('LayoutModule')
.controller('CreateFolderModalController', ['$scope', '$modalInstance', 'FSystem', '$rootScope', function ($scope, $modalInstance, FSystem, $rootScope){

	$scope.createFolder = function(foldername) {
        var breadcrumb = $rootScope.breadcrumb;

        if (breadcrumb == '//') {
            breadcrumb = '';
        }

        console.debug($rootScope.breadcrumb);
		FSystem.r.createFolder({}, { filename: breadcrumb + '/' + foldername }, function(data) {
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
			console.log(progress);
			$rootScope.$emit('FSystem.fileAdd', progress.model);
		})
	};

	$scope.cancel = function () {
		console.log($rootScope.breadcrumb);
		$modalInstance.dismiss('cancel');
	};

}]);