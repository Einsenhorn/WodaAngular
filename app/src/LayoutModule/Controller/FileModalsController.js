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

	$scope.$watch(FileTransfer.files, function(data){
		console.log('WE HERE!');
		
	});

	$scope.startUpload = function(file) {
		var progress = {};

		transfer = FileTransfer.upload(file, progress);

		console.log(transfer);
		transfer.then(function(data){
			console.log(progress);
			$rootScope.$emit('FSystem.fileAdd', progress.model);
		})

		FileTransfer.files.push(progress);

		$scope.$watch(progress, function(data){
			console.log('test >>>> ', $scope.progress);
		});

		// FileTransfer.files.push(file);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);