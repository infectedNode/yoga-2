;(function( $, window, document, undefined ){

	var INSTANT_SEARCH = {
		is_on_request: false,
		delay_search: null,
		keywords: '',
		form_template: '<form class="vw-instant-search-panel" method="get" autocomplete="off"> <input type="text" id="s" name="s" value="" placeholder="'+instant_search.placeholder+'"> <div class="vw-loading-icon vw-preloader-bg"></div> <ul class="vw-instant-search-result-panel"></ul> </form>',
		defaults: {
			search_delay: 350,
		},

		init: function( el, options ) {
			this.options = $.extend({}, this.defaults, options);

			this.startSearch = $.proxy( this.startSearch, this );
			this.onClickIcon = $.proxy( this.onClickIcon, this );
			this.onClickOutside = $.proxy( this.onClickOutside, this );
			this.onTyping = $.proxy( this.onTyping, this );
			this.onRequestCompleted = $.proxy( this.onRequestCompleted, this );

			this.$form = $( this.form_template );
			this.$searchbox = $( '#s', this.$form );
			this.$loading = $( '.vw-loading-icon', this.$form );
			this.$result_panel = $( '.vw-instant-search-result-panel', this.$form );

			this.$icon = $( el );
			this.$icon.click( this.onClickIcon );
			this.$icon.after( this.$form );
			this.initForm();

			$(document).mousedown( this.onClickOutside );
		},

		initForm: function() {
			this.$form.hide();
			this.$form.attr( 'action', instant_search.blog_url );
			this.$searchbox.keyup( this.onTyping );
		},

		startSearch: function() {
			this.$loading.show();
			if ( this.is_on_request ) {
				this.request.abort();
			}

			this.is_on_request = true;

			this.request = $.ajax({
				url: instant_search.ajax_url,
				data: { s: this.keywords, action: 'vw_instant_search' },
				success: this.onRequestCompleted,
			});
		},

		showPanel: function() {
			this.$form.css( 'opacity', '0' ).show();
			this.$form.animate( { opacity: 1, marginTop: '0px' }, { duration: 150 } );
		},

		hidePanel: function() {
			this.$form.animate( { opacity: 0, marginTop: '-10px' }, { duration: 150, complete: function() {
				$(this).hide();
			} } );
		},

		onClickIcon: function( e ) {
			e.preventDefault();

			if ( ! this.$form.is( ':visible' ) ) {
				this.showPanel();
				this.$searchbox.focus();
			} else {
				this.hidePanel();
			}

			return false;
		},

		onClickOutside: function( e ) {
			if ( ( ! this.$form.is(e.target) && this.$form.has(e.target).length === 0 )
			  && ( ! this.$icon.is(e.target) && this.$icon.has(e.target).length === 0)
			) {
				this.hidePanel();
			}
		},

		onRequestCompleted: function( data ) {
			this.$result_panel.empty();
			this.$result_panel.append( data );

			this.is_on_request = false;
			this.$loading.hide();
			// $(".vw-imgliquid").imgLiquid();
		},

		onTyping: function( e ) {
			var keywords = this.$searchbox.val();

			if ( keywords == this.keywords ) return;
			if ( keywords.length < 3 ) {
				clearTimeout( this.delay_search );
				this.$loading.hide();
				return;
			}

			if ( this.delay_search ) {
				clearTimeout( this.delay_search );
			}

			this.keywords = keywords;
			this.delay_search = setTimeout( this.startSearch , this.options.search_delay );
		},
	}

	$.fn.instant_search = function( arg1 ) {
		return this.each(function() {
			var instant_search = $.extend( {}, INSTANT_SEARCH );

			instant_search.init( this, arg1 );
		});
	};

})( jQuery, window , document );