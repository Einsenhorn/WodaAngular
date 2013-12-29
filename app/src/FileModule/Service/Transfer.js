angular.module( 'FileModule' )

    .factory( 'FileTransfer', function ( $q, $http, $rootScope, WodaConfiguration ) {

        function bin2hex( buffer ) {

            var view = new Uint8Array( buffer );
            var hex = [ ];

            for ( var t = 0, T = view.length; t < T; t ++)
                hex.push( view[ t ].toString( 16 ).replace( /^([\da-f])$/, '0$1' ) );

            return hex.join( '' );

        }

        return {

            upload : function ( file ) {

                var readParts = function ( descriptor, initial, callback ) {

                    var defer = $q.defer( ), promise = defer.promise;
                    defer.resolve( initial );

                    var file = descriptor.file;
                    var partSize = descriptor.partSize;

                    var offset = 0, size = file.size;
                    for ( ; size > 0; offset += partSize, size -= partSize ) {

                        promise = promise.then( function ( offset, size, success ) {

                            var sub = file.slice( offset, offset + partSize );
                            var defer = $q.defer( ), promise = defer.promise;

                            var next = function ( ) {
                                callback( success, fileReader.result ).then( function ( success ) {
                                    defer.resolve( success );
                                } );
                            };

                            var fileReader = new FileReader( );
                            fileReader.addEventListener( 'load', next );
                            fileReader.readAsArrayBuffer( sub );

                            return promise;

                        }.bind( null, offset, size ) );

                    }

                    return promise;

                };

                var computeSHA256 = function ( descriptor ) {
                    return readParts( descriptor, new Digest.SHA256( ), function ( digest, data ) {

                        digest.update( data );

                        var defer = $q.defer( ), promise = defer.promise;
                        defer.resolve( digest );

                        return promise;

                    } ).then( function ( digest ) {

                        return bin2hex( digest.finalize( ) );

                    } );
                };

                var sendParts = function ( descriptor ) {
                    return readParts( descriptor, 0, function ( index, data ) {

                        var defer = $q.defer( ), promise = defer.promise;
                        defer.resolve( index + 1 );

                        if ( descriptor.requestedParts.indexOf( index ) === - 1)
                            return promise;

                        return $http.put( WodaConfiguration.host + '/sync/' + descriptor.id + '/' + index, data, {
                            withCredentials : true,
		            headers: {
			        'Content-Type': 'application/octet-stream',
			        'X-Requested-With': '' },
                            transformRequest : function ( data ) { return data; }
                        } ).then( function ( ) {
                            return promise;
                        } );

                    } );
                };

                var processUpload = function ( descriptor ) {

                    descriptor.partSize = WodaConfiguration.partSize;

                    return computeSHA256( descriptor ).then( function ( hash ) {

                        return $http.put( WodaConfiguration.host + '/sync', {
                            filename : file.name,
                            content_hash : hash,
                            size : descriptor.file.size
                        }, {
                            withCredentials : true,
		            headers: { 'Content-Type': 'application/json', 'X-Requested-With': '' }
                        } ).then( function ( response ) {

                            descriptor.partSize = response.part_size;
                            descriptor.requestedParts = response.requested_parts;

                            console.log( descriptor );

                            return sendParts( descriptor );

                        } );

                    } );

                };

                if ( ! file ) {

                    var defer = $q.defer( ), promise = defer.promise;
                    defer.reject( 'No file' );
                    return promise;

                } else {

                    return processUpload( {
                        file : file
                    } );

                }

            },

            download : function ( id ) {

                var file = {
                    parts : [ ], blob : null, url : null };

                $http.get( WodaConfiguration.host + '/files/' + id, {
                    withCredentials : true
                } ).success( function ( data ) {

                    for ( var t = 0, T = Math.ceil( data.file.size / data.file.part_size ); t < T; ++ t )
                        file.parts[ t ] = { index : t, progress : 0, blob : null };

                    $q.all( file.parts.map( function ( part ) {

                        return $http.get( WodaConfiguration.host + '/sync/' + id + '/' + part.index, {
                            withCredentials : true,
                            responseType : 'arraybuffer'
                        } ).success( function ( data ) {
                            part.blob = new Blob( [ data ] );
                        } );

                    } ) ).then( function ( ) {

                        file.blob = new Blob( file.parts.map( function ( part ) { return part.blob; } ) );
                        file.url = window.URL.createObjectURL( file.blob );
                        console.log( file.url );

                    } );

                } );

                return file;

            }

        };

    } );