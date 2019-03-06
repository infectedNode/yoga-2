if ( jQuery ) {

	;(function( $, window, document, undefined ){
		"use strict";

		jQuery( document ).ready( function() {

			$( '.vw-post-shares-social' ).click( function( e ) {
				var share_to = $( this ).data( 'share-to' );
				var post_id = $( this ).data( 'post-id' );
				jQuery.ajax( {
					type: "POST",
					url: vw_post_shares.ajaxurl,
					data: {
						'post_id': post_id,
						'social': share_to,
						'action': 'vwpsh-count-share',
					},
					cache: false,
					success: function( result ) {
						console.log(result);
						$( '.vw-post-share-number' ).html( result );
					}
				} );
				
				e.preventDefault();
			} );

			$( '.vw-post-shares-social' ).click( function( e ) {
				
				var $this = $( this );
				var url = $this.attr( 'href' );
				var width = $this.data( 'width' );
				var height = $this.data( 'height' );
				var leftPosition, topPosition;
				//Allow for borders.
				leftPosition = (window.screen.width / 2) - ((width / 2) + 10);
				//Allow for title and status bars.
				topPosition = (window.screen.height / 2) - ((height / 2) + 50);

				var windowFeatures = "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
				window.open( url,'sharer', windowFeatures );
				
				e.preventDefault();
			} );

		} );

	} )( jQuery, window , document );

} else {
	console.warn( 'Theme: jQuery does not loaded properly. Post shares function will be disabled.' );
}