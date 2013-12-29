( function ( ) {
    var x = document.createElement( 'pre' );
    x.style.cssText = 'display:block;margin:0;position:absolute;right:0;top:0;min-height:100%;width:20%;background:white;padding:10px;border-left:1px solid black;';

    window.addEventListener( 'load', function ( ) {
        document.body.appendChild( x );
    } );

    var realLog = window.console.log;
    window.console.log = function ( message ) {
        realLog.apply( window.console, arguments );
        message = typeof message === 'object' ? JSON.stringify( message ) : message;
        x.appendChild( document.createTextNode( message + '\n' ) );
    };
} )( );
