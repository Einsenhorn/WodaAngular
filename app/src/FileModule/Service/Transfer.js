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

			upload : function ( file, descriptor ) {

				var readParts = function ( descriptor, initial, callback ) {

					var defer = $q.defer( );
					var promise = defer.promise;
					defer.resolve( initial );

					var file = descriptor.file;
					var partIndex = 0;
					var partSize = descriptor.partSize;
					var partCount = Math.ceil( file.size / partSize );

					for ( ; partIndex < partCount; ++ partIndex ) {
						promise = promise.then( function ( partIndex, success ) {
							var offset = partIndex * partSize;
							var sub = file.slice( offset, offset + partSize );
							var defer = $q.defer( ), promise = defer.promise;

							var next = function ( ) {
								descriptor.partIndex = partIndex;
								descriptor.partCount = partCount;
								callback( success, fileReader.result ).then( function ( success ) {
									descriptor.partIndex = partIndex + 1;
									descriptor.partCount = partCount;
									defer.resolve( success );
								} );

							};

							var fileReader = new FileReader( );
							fileReader.addEventListener( 'load', next );
							fileReader.readAsArrayBuffer( sub );

							return promise;

						}.bind( null, partIndex ) );

					}

					return promise;

				};

				var computeSHA256 = function ( descriptor ) {

					descriptor.status = 'hashing';

					return readParts( descriptor, new Digest.SHA256( ), function ( digest, data ) {
						digest.update( data );
						var defer = $q.defer( ), promise = defer.promise;
						defer.resolve( digest );
						return promise;

					} ).then( function ( digest ) {
						descriptor.partIndex = '';
						descriptor.partCount = '';
						descriptor.status = 'starting';
						return bin2hex( digest.finalize( ) );
					} );

				};

				var sendParts = function ( descriptor ) {

					descriptor.status = 'sending';


					return readParts( descriptor, 0, function ( index, data ) {
						var defer = $q.defer( ), promise = defer.promise;
						defer.resolve( index + 1 );

						if ( descriptor.requestedParts.indexOf( index ) === - 1)
							return promise;

						return $http.put(WodaConfiguration.host + '/sync/' + descriptor.id + '/' + index, data, {
									withCredentials : true,
									headers: {
										'Content-Type': 'application/octet-stream',
										'X-Requested-With': ''
									},
									transformRequest : function ( data ) { return data; }
								}).then(function ( ) {
									console.log(descriptor.partIndex, descriptor.partCount);
									if (descriptor.partIndex == descriptor.partCount - 1)
										descriptor.status = 'done';
									return promise;
								},
								function( response ){
									descriptor.status = 'failed';
									descriptor.error = response.data;
								});
					} );

				};

				var processUpload = function ( descriptor ) {

					descriptor.partSize = WodaConfiguration.partSize;

					var filename = $rootScope.breadcrumb.substr(1)+file.name;
					return computeSHA256( descriptor ).then( function ( hash ) {
						return $http.put( WodaConfiguration.host + '/sync', {
							filename : filename,
							content_hash : hash,
							size : descriptor.file.size.toString( )
						}, {
							withCredentials : true,
							headers: { 'Content-Type': 'application/json', 'X-Requested-With': '' }
						} ).then(function(response) {
							response = response.data;
							descriptor.model = response.file;
							descriptor.id = response.file.id;
							descriptor.partSize = response.part_size;
							descriptor.requestedParts = response.needed_parts;

							return sendParts( descriptor );
						}, function(response) {
							descriptor.status = 'failed';
							descriptor.error = response.data;

							console.log('Failed file creation : ' + response.data.message);
							console.log(descriptor);
						});



						// .success( function ( response ) {

							

						// }).error(function( data ){
						//     console.log('File creation failed >> ' + data);
						// });

					} );

				};

				if ( ! file ) {
					var defer = $q.defer( ), promise = defer.promise;
					defer.reject( 'No file' );
					return promise;
				} else {
					descriptor = descriptor || { };
					descriptor.file = file;

					return processUpload( descriptor );

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

					} );

				} );

				return file;

			},

			files: [],

		};

	} );