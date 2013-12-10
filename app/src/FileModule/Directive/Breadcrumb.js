angular.module('FileModule').directive('fsystemBreadcrumb', ['$routeParams', 'FSystem', function($routeParams, FSystem) {
	return {
		template: '<a href="#"></a>',
		controller: function() {
			/*var FileLoop = function(node, id) {
				angular.forEach(node.files, function(file, k) {
					console.debug('fichier: ' + file.name);
					if (file.id == id) {
						console.debug('FSystem TROUVE: ' + file.name);
					}
				})
			},	FolderLoop = function(node, id) {
				angular.forEach(node.folders, function(folder, k) {
					console.debug('folder: ' + folder.name);
					if (folder.id == id) {
						console.debug('FSystem TROUVE: ' + folder.name);
					} else {
						FolderLoop()
					}
				})
			},	generateBreadcrumb = function(root, id) {
				FolderLoop(root, id);
				return (42);
			}

			FSystem.r.get({}, function(data, httpResponse) {
					console.debug('---');

console.debug(data.folder);
					var root = data.folder,
						breadcrumb = generateBreadcrumb(root, 145);//$routeParams.hasOwnProperty("FSystemId") ? generateBreadcrumb(root, $routeParams.FSystemId) : '/';

					console.debug('breadcrumb = ' + breadcrumb);
					console.debug('---');
				}, function(httpResponse) {
					if (httpResponse.status == 400) {
						;
					}
			});
*/
		}
		/*
		link: function(scope, element, attrs) {
			FSystem.r.get({}, function(data, httpResponse) {
					//$scope.root = data.hasOwnProperty("folder") ? data.folder : data.file;
				}, function(httpResponse) {
					if (httpResponse.status == 400) {
						;
					}
			});
			console.debug('ici')
			element.bind("click", function() {
				console.debug('hello world !')
			});
		}
		*/
	};
}]);