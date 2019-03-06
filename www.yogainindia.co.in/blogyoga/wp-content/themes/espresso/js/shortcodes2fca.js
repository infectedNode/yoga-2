/* -----------------------------------------------------------------------------
 * Document ready
 * -------------------------------------------------------------------------- */
;(function( $, window, document, undefined ){
	"use strict";
	
	$( document ).ready( function ($) {

		// -----------------------------------------------------------------------------
		// Accordion
		// 
		$( ".vw-accordion" ).each( function( i, e ) {
			var $this = $( e );
			var options = {
				heightStyle: 'content',
				header: '.vw-accordion-header',
				collapsible: true
			}

			if ( $this.data( 'open' ) == true ) {
				options.active = 0;
			} else {
				options.active = false;
			}

			$this.accordion( options );
		} );

		// -----------------------------------------------------------------------------
		// Tabs
		//
		$( '.vw-tabs' ).each( function( i, el ) {
			var $tabs = $( el );
			var is_tabs_initialed = false;
			
			$( '.vw-tab-title', $tabs ).click( function( e ) {
				var $tab = $( this );
				var $content = $( $tab.attr( 'href' ) );
				var tab_selector = '#tab-'+$tab.data( 'tab-id' );

				if ( $content.length ) {
					$( '.active', $tabs ).removeClass( 'active' );
					$( '.vw-tab-content', $tabs ).hide();
					$content.show();
					$( '.tab-id-'+$tab.data( 'tab-id' ), $tabs ).addClass( 'active' );
				}

				e.preventDefault();
				if ( is_tabs_initialed ) {
					if(history.pushState) {
				    	history.pushState(null, null, tab_selector);
					} else {
				    	location.hash = tab_selector;
					}
				}
				
				return false;
			} );

			var $selected_tab = $( location.hash+'.vw-tab-content' );
			if ( $selected_tab.length )  {
				$( '.vw-tab-title.tab-id-'+$selected_tab.data( 'tab-id' ) ).trigger( 'click' );

			} else {
				$( '.vw-tab-title', $tabs ).eq( 0 ).trigger( 'click' );

			}

			is_tabs_initialed = true;

		} );

	} );
})( jQuery, window , document );