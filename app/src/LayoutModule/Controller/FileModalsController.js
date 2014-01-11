angular.module('LayoutModule')
.controller('CreateFolderModalController', ['$scope', '$modalInstance', 'FSystem', '$rootScope', function ($scope, $modalInstance, FSystem, $rootScope){

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

}])
.controller('UploadModalController', ['$modalInstance', '$scope', 'FileTransfer', '$rootScope', function ($modalInstance, $scope, FileTransfer, $rootScope){

	$scope.files = FileTransfer.files;

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
		$modalInstance.dismiss('cancel');
	};

}]);