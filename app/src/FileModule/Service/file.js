angular.module( 'woda.file', [ 'woda.configuration' ] )

    .factory( function ( $q, $http, configuration ) {

        return {

            upload : function ( file ) {

                var next = function ( ) {
                    var data = fileReader.result;
                    var hash = new Digest.SHA256( ).digest( data );

                    $http.put( configuration.host + '/sync', {
                    } ).success( function ( data ) {
                        if ( ! data.need_upload ) return ;
                        data.needed_parts.forEach( function ( requestedPart ) {
                            var begin = requestedPart * data.part_size, end = begin + data.part_size;
                            $http.put( configuration.host + '/sync/' + data.file.id + '/' + requestedPart, file.slice( begin, end ), {
                                headers : { 'Content-Type' : 'application/raw-data' },
                                transformRequest : function ( data ) { return data; }
                            } );
                        } );
                    } );
                };

                var fileReader = new FileReader( );
                fileReader.addEventListener( next );
                fileReader.readAsArrayBuffer( file );

            },

            download : function ( id ) {

                var file = {
                    parts : [ ], blob : null, url : null };

                $http.get( configuration.host + '/files/' + id, {

                } ).success( function ( data ) {

                    for ( var t = 0; t < data.partCount; ++ t )
                        file.parts[ t ] = { index : t, progress : 0, blob : null };

                    $q.all( file.parts.map( function ( part ) {

                        return $http.get( configuration.host + '/sync/' + id + '/' + part.index, {
                            responseType : 'arraybuffer'
                        } ).success( function ( data ) {
                            part.blob = new Blob( [ data ] );
                        } );

                    } ) ).then( function ( ) {

                        file.blob = new Blob( file.parts.map( function ( part ) { return part.blob; } ) );
                        file.url = window.URL.createObjectURL( file.blob );

                    } );

                } );

                return file;

            }

        };

    } );