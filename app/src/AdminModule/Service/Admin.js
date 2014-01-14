angular.module('AdminModule').factory('Admin', ['$q', '$resource', 'WodaConfiguration', function($q, $resource, WodaConfiguration) {
    var headers = { 'Content-Type': 'application/json' };

    return {
        fsystem: [],
        users: [],
        r: $resource(WodaConfiguration.host + '/admin', {}, {
            getUsers: {
                url: WodaConfiguration.host + '/admin/users',
                method: 'GET',
                withCredentials: true,
                headers: headers
            }, deleteUser: {
                url: WodaConfiguration.host + '/admin/users/:user',
                method: 'DELETE',
                withCredentials: true,
                headers: headers
            }, UpdateSpaceUser: {
                url: WodaConfiguration.host + '/admin/users/:user/update_space/:newSpace',
                method: 'POST',
                withCredentials: true,
                headers: headers
            }, getFSystemFromUser: {
                url: WodaConfiguration.host + '/admin/files',
                method: 'GET',
                withCredentials: true,
                headers: headers
            }, deleteFile: {
                url: WodaConfiguration.host + '/admin/files/:FSystemId',
                method: 'DELETE',
                withCredentials: true,
                headers: headers
            }
        })
    };
}]);
