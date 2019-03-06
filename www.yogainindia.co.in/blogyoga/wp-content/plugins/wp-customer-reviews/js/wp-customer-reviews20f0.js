var wpcr3 = wpcr3 || {};
wpcr3.mousemove_total = 0;
wpcr3.keypress_total = 0;
wpcr3.mousemove_need = 5;
wpcr3.keypress_need = 5;

wpcr3.getPostUrl = function(elm) {
	var ajaxurl = elm.attr("data-ajaxurl");
	ajaxurl = JSON.parse(ajaxurl);
	ajaxurl = ajaxurl.join('.').replace(/\|/g,'/')
	return ajaxurl;
};

wpcr3.onhover = function() {
	var $ = jQuery;
    $(".wpcr3_respond_2 .wpcr3_rating_stars").unbind("click.wpcr3");
    $(".wpcr3_respond_2 .wpcr3_rating_style1_base").addClass('wpcr3_hide');
    $(".wpcr3_respond_2 .wpcr3_rating_style1_status").removeClass('wpcr3_hide');
};

wpcr3.set_hover = function() {
	var $ = jQuery;
	$(".wpcr3_frating").val("");
    $(".wpcr3_respond_2 .wpcr3_rating_stars").unbind("click.wpcr3");
    wpcr3.onhover();
};

wpcr3.showform = function() {
	var $ = jQuery;
	var t = $(this);
	var parent = t.closest(".wpcr3_respond_1");
	
	var btn1 = parent.find(".wpcr3_respond_3 .wpcr3_show_btn");
    var resp2 = parent.find(".wpcr3_respond_2");
	resp2.slideToggle(400, function() {
		parent.find(".wpcr3_table_2").find("input:text:visible:first").focus();
		if (resp2.is(":visible")) {
			btn1.addClass('wpcr3_hide');
		} else {
			btn1.removeClass('wpcr3_hide');
		}
	});
};

wpcr3.ajaxPost = function(parent, data, cb) {
	return jQuery.ajax({
		type : "POST",
		url : wpcr3.getPostUrl(parent),
		data : data,
		dataType : "json",
		success : function(rtn) {
			if (rtn.err.length) {
				rtn.err = rtn.err.join('\n');
				alert(rtn.err);
				wpcr3.enableSubmit();
				return cb(rtn.err);
			}
			
			return cb(null, rtn);
		},
		error : function(rtn) {
			alert('An unknown error has occurred. E01');
			wpcr3.enableSubmit();
		}
	});
};

wpcr3.submit = function(e) {
	var $ = jQuery;
	var t = $(this);
	var parent = t.closest(".wpcr3_respond_1");
	e.preventDefault();

	var div2 = parent.find('.wpcr3_div_2'), submit = div2.find('.wpcr3_submit_btn');
	var c1 = parent.find('.wpcr3_fconfirm1'), c2 = parent.find('.wpcr3_fconfirm2'), c3 = parent.find('.wpcr3_fconfirm3');
	var fake_website = parent.find('.wpcr3_fake_website'), fake_url = parent.find('.wpcr3_fake_url');
	
	if (submit.hasClass('wpcr3_disabled')) { return false; }
	
	if (wpcr3.mousemove_total <= wpcr3.mousemove_need || wpcr3.keypress_total <= wpcr3.keypress_need) {
		alert('You did not pass our human detection check. Code '+wpcr3.mousemove_total+','+wpcr3.keypress_total);
		return false;
	}
	
	var c1_fail = (c1.is(':checked') === true), c2_fail = (c2.is(':checked') === false), c3_fail = (c3.is(':checked') === false);
	var fake_fail = (fake_website.val().length > 0);
	if (c1_fail || c3_fail || fake_fail) {
		alert('You did not pass our bot detection check. Code '+c1_fail+','+c3_fail+','+fake_fail);
		return false;
	}
	if (c2_fail) {
		alert('You must check the box to confirm you are human.');
		return false;
	}
	
	var fields = div2.find('input,textarea');
	
	var req = [];
	$.each(fields, function(i,v) {
		v = $(v);
		if (v.hasClass('wpcr3_required') && $.trim(v.val()).length === 0) {
			var label = div2.find('label[for="'+v.attr('id')+'"]'), err = '';
			if (label.length) {
				err = $.trim(label.text().replace(':',''))+' is required.';
			} else {
				err = 'A required field has not been filled out.';
			}
			req.push(err);
		}
	});
	
	if (req.length > 0) {
		req = req.join("\n");
		alert(req);
		return false;
	}
	
	submit.addClass('wpcr3_disabled');
	
	var postid = parent.attr("data-postid");
	div2.find('.wpcr3_checkid').remove();
	div2.append('<input type="hidden" name="wpcr3_checkid" class="wpcr3_checkid" value="'+postid+'" />');
	div2.append('<input type="hidden" name="wpcr3_ajaxAct" class="wpcr3_checkid" value="form" />');
	fields = div2.find('input,textarea');
	
	var ajaxData = {};
	fields.each(function(i, v) {
		v = $(v), val = v.val();
		if (v.attr('type') === 'checkbox' && v.is(':checked') === false) { val = '0'; }
		ajaxData[v.attr('name')] = val;
	});
	
	wpcr3.ajaxPost(parent, ajaxData, function(err, rtn) {
		if (err) { return; }
		
		alert('Thank you! Your review has been received and will be posted soon.');
		$(window).scrollTop(0);
		wpcr3.clearFields();
		parent.find(".wpcr3_cancel_btn").click();
	});
};

wpcr3.clearFields = function() {
	var $ = jQuery;
	var div2 = $('.wpcr3_div_2'), fields = div2.find('input,textarea');;
	wpcr3.enableSubmit();
	fields.attr('autocomplete', 'off').not('[type="checkbox"], [type="hidden"]').val('');
};

wpcr3.enableSubmit = function() {
	var $ = jQuery;
	var div2 = $('.wpcr3_div_2'), submit = div2.find('.wpcr3_submit_btn');
	submit.removeClass('wpcr3_disabled');
};

wpcr3.init = function() {
	var $ = jQuery;
	
	$(".wpcr3_respond_3 .wpcr3_show_btn, .wpcr3_respond_2 .wpcr3_cancel_btn").click(wpcr3.showform);
	
	var evt_1 = 'mousemove.wpcr3 touchmove.wpcr3';
	$(document).bind(evt_1, function() {
		wpcr3.mousemove_total++; if (wpcr3.mousemove_total > wpcr3.mousemove_need) { $(document).unbind(evt_1); }
	});
	
	var evt_2 = 'keypress.wpcr3 keydown.wpcr3';
	$(document).bind(evt_2, function() {
		wpcr3.keypress_total++; if (wpcr3.keypress_total > wpcr3.keypress_need) { $(document).unbind(evt_2); }
	});
	
	$(".wpcr3_respond_2 .wpcr3_rating_style1_score > div").click(function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var wpcr3_rating = $(this).html(), new_w = 20 * wpcr3_rating + "%";
		$(".wpcr3_frating").val(wpcr3_rating);
		$(".wpcr3_respond_2 .wpcr3_rating_style1_base").removeClass('wpcr3_hide');
		$(".wpcr3_respond_2 .wpcr3_rating_style1_average").css("width",new_w);
		$(".wpcr3_respond_2 .wpcr3_rating_style1_status").addClass('wpcr3_hide');

		$(".wpcr3_respond_2 .wpcr3_rating_stars").unbind("mouseover.wpcr3").bind("click.wpcr3", wpcr3.set_hover);
		
		return false;
    });

    $(".wpcr3_respond_2 .wpcr3_rating_stars").bind("mouseover.wpcr3", wpcr3.onhover);
	
	var pagingCb = function(e) {
		e.preventDefault();
		var t = $(this);
		if (t.hasClass("wpcr3_disabled")) { return false; }
		
		var parent = t.parents(".wpcr3_respond_1:first");
		var pager = t.parents(".wpcr3_pagination:first");
		var reviews = parent.find(".wpcr3_reviews_holder");
		var page = t.attr("data-page");
		var pageOpts = pager.attr("data-page-opts");
		var on_postid = parent.attr("data-on-postid");
		
		var ajaxData = { ajaxAct : "pager", on_postid : on_postid, page : page, pageOpts : pageOpts };
		wpcr3.ajaxPost(parent, ajaxData, function(err, rtn) {
			if (err) { return; }
			
			reviews.html(rtn.output);
			pager.remove();
			$('html,body').animate({
			   scrollTop : (reviews.offset().top - 100)
			});
		});	
	};
	
	if ($("body").on !== undefined) {
		$(".wpcr3_respond_1").on("click", ".wpcr3_pagination .wpcr3_a", pagingCb);
	} else {
		// support older versions of jQuery
		$(".wpcr3_respond_1 .wpcr3_pagination .wpcr3_a").live("click", pagingCb);
	}
	
	var div2 = $('.wpcr3_div_2'), submit = div2.find('.wpcr3_submit_btn');
	submit.click(wpcr3.submit);
	
	wpcr3.clearFields();
};

jQuery(function() {
	wpcr3.init();
});