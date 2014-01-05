angular.module('FileModule').filter('Checkmark', function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
});