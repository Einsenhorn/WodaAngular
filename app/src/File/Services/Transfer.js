angular.module( 'woda.file.transfer', [ 'woda.configuration' ] )

    .factory( 'WodaFileTransfer', function ( $q, $http, $rootScope, WodaParameters ) {

        function bin2hex( buffer ) {

            var view = new Uint8Array( buffer );
            var hex = [ ];

            for ( var t = 0, T = view.length; t < T; t ++)
                hex.push( view[ t ].toString( 16 ).replace( /^([\da-f])$/, '0$1' ) );

            return hex.join( '' );

        }

        return {

            upload : function ( file ) {

                var next = function ( ) {
                    var data = fileReader.result;
                    var hash = bin2hex( new Digest.SHA256( ).digest( data ) );

                    $http.put( WodaParameters.host + '/sync', {
                        filename : file.name,
                        content_hash : hash,
                        size : data.byteLength.toString( )
                    }, {
                        withCredentials : true,
		        headers: {
			    'Content-Type': 'application/json',
			    'X-Requested-With': ''
		        }
                    } ).success( function ( data ) {
                        if ( ! data.need_upload ) return ;
                        data.needed_parts.forEach( function ( requestedPart ) {
                            var begin = requestedPart * data.part_size, end = begin + data.part_size;
                            $http.put( WodaParameters.host + '/sync/' + data.file.id + '/' + requestedPart, file.slice( begin, end ), {
                                withCredentials : true,
		                headers: {
			            'Content-Type': 'application/octet-stream',
			            'X-Requested-With': ''
		                },
                                transformRequest : function ( data ) { return data; }
                            } );
                        } );
                    } );
                };

                var fileReader = new FileReader( );
                fileReader.addEventListener( 'load', next );
                fileReader.readAsArrayBuffer( file );

            },

            download : function ( id ) {

                var file = {
                    parts : [ ], blob : null, url : null };

                $http.get( WodaParameters.host + '/files/' + id, {
                    withCredentials : true
                } ).success( function ( data ) {

                    for ( var t = 0, T = Math.ceil( data.file.size / data.file.part_size ); t < T; ++ t )
                        file.parts[ t ] = { index : t, progress : 0, blob : null };

                    $q.all( file.parts.map( function ( part ) {

                        return $http.get( WodaParameters.host + '/sync/' + id + '/' + part.index, {
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