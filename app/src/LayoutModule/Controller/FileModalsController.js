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
.controller('UploadModalController', ['$modalInstance', '$scope', 'FileTransfer', function ($modalInstance, $scope, FileTransfer){

	$scope.startUpload = function(file) {
		console.log('HEY');
		file = FileTransfer.upload(file);
		console.log(file);
		file.then(function(upload) {
		  console.log(upload);
		}, function(reason) {
		  alert('Failed: ' + reason);
		  console.log(reason);
		}, function(update) {
		  alert('Got notification: ' + update);
		});
		FileTransfer.files.push(file);
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

}]);