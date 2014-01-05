angular.module('Woda').service('WodaConfiguration', function () {
    return {
        host : 'http://kobhqlt.fr:3000',
        version : '0.1',
        partSize : 10 * (/*MB*/ 1024 * 1024)
    };
});