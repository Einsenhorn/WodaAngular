angular.module( 'woda.file.transfer', [ 'woda.configuration' ] )

    .factory( 'WodaFileTransfer', function ( $q, $http, WodaParameters ) {

        function bin2hex( buffer ) {

            var i, f = 0, a = [], data = new Uint8Array(buffer);
            f = data.length;

            for (i = 0; i < f; i++) {
                a[i] = data[i].toString(16).replace(/^([\da-f])$/, "0$1");
            }

            return a.join('');
        }

        return {

            upload : function ( file ) {

                var next = function ( ) {
                    var data = fileReader.result;
                    var hash = bin2hex( new Digest.SHA256( ).digest( data ) );

                    $http.put( WodaParameters.host + '/sync', {
                        filename : file.name,
                        content_hash : hash,
                        size : data.byteLength
                    }, {
                        withCredentials : true
                    } ).success( function ( data ) {
                        if ( ! data.need_upload ) return ;
                        data.needed_parts.forEach( function ( requestedPart ) {
                            var begin = requestedPart * data.part_size, end = begin + data.part_size;
                            $http.put( WodaParameters.host + '/sync/' + data.file.id + '/' + requestedPart, file.slice( begin, end ), {
                                headers : { 'Content-Type' : 'application/raw-data' },
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

                } ).success( function ( data ) {

                    for ( var t = 0; t < data.partCount; ++ t )
                        file.parts[ t ] = { index : t, progress : 0, blob : null };

                    $q.all( file.parts.map( function ( part ) {

                        return $http.get( WodaParameters.host + '/sync/' + id + '/' + part.index, {
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