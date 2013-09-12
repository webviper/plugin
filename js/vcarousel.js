/**
 * VCarousel - jQuery plugin to navigate images/any content in a carousel style widget.
 * @requires jQuery v1.2 or above
 *
 * http://www.web-viper.com/plugin/vcarousel/
 *
 * Copyright (c) 2011 Sendetsky Vitaly (web-viper.com)
 * @author Sendetsky Vitaly/web.viper@yandex.ru
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 1.0
 */
(function($) {
	$.fn.VCarousel = function(o) {   /*   ---  VCarousel Options   ---   */
		o = $.extend({
			visible: 3,    /*    number of visible items carousel    */
			ID: 1,
			easing: null,    /*    type animation    */
			step: 1,   /*    step animation    */
			play: null,  /*    playback carousel    */  
			playBack: false,   /*    if true, play back animation    */ 
			hoverStop: true,   /*     Stop when you hover on the carousel     */
			speed: 500,    /*     animation speed     */
			prevId: '',   /*     You can specify the selector of the button Prev     */
			nextId: '',   /*     You can specify the selector of the button Next     */
			prevText: 'Prev',    /*     Text on button Prev    */
			nextText: 'Next',    /*     Text on button Next    */
			vertical: false   /*     If true, the carousel will be the vertical   */
		}, o || {} ); 
		return this.each(function () {
			var s = $(this), 
				prev, 
				next,
				n = s.children().length;
			if (o.vertical) {
				s.addClass("vc-list_vertical");
			} else {
				s.addClass("vc-list_horizontal");
			}
			if (o.visible <= 0 || typeof o.visible === "string") {
				o.visible = 1;
			}
			if (o.visible > n) {
				o.visible = n; 
			}
			if (o.play > 0 && o.play < 70) {
				o.play = 70;
			}
			s.addClass("vc-list")
				.attr("id", "vc"+ o.ID)
				.find("img")
				.addClass("vc-list-item-imgWrap-image")
				.wrap("<div class='vc-list-item-imgWrap'></div>");
			var W = s.children().outerWidth(true),	   
				H = s.children().outerHeight(true);
/*     Auto fit all element and wrap to the carousel    */	
			function fitH() {
				var HFull = [], 
					HOnly = [];
				for (var i = n; i--;) {
					HFull[i] = s.children().eq(i).outerHeight(true);
					HOnly[i] = s.children().eq(i).height();
					s.children()
						.eq(i)
						.attr("id", "vc"+ o.ID +"Element"+ (i + 1));
				}
				s.children()
					.css("height", Math.max.apply(Math, HOnly) +"px")
					.addClass("vc-list-item");
				H = Math.max.apply(Math, HFull);
			}
			fitH();
			var pEnd = o.vertical ? (H * n) - (H * o.visible) : (W * n) - (W * o.visible);   /*     End position carousel    */
			s.css("width", o.vertical ? W +"px" : W * n +"px").wrap("<div class='vc'></div>"); 
			s.parent().css({
				"float": o.vertical ? 'none' : 'left', 
				"width": o.vertical ? W +"px" : (n < o.visible) ? W * n : W * o.visible +"px", 
				"height": o.vertical ? (n < o.visible ? H * n : H * o.visible +"px") : H +"px"
			});
/*     If have ID button Prev    */
			if (o.prevId != '' && typeof o.prevId === "string") {
				prev = $(o.prevId);   
			} else {
			    s.parent().before("<button class='vcButton vcButton_prev'></button>");
				prev = s.parent().prev();
				prev.text(o.prevText);   /*     Text on button Prev     */
			}
/*     If have ID button Next    */
			if (o.nextId != '' && typeof o.nextId === "string") {
				next = $(o.nextId);   
			} else {
			    s.parent().after("<button class='vcButton vcButton_next'></button>");
				next = s.parent().next();
				next.text(o.nextText);   /*     Text on button Next     */
			}
			var point = o.vertical ? s.position().top : s.position().left,   /*     Stores the position of the carousel     */
				step = o.vertical ? H * o.step : W * o.step,   /*    Step animation     */
				stepN = o.vertical ? H : W,
				animated = 0;   /*     Variable to test the animation carousel     */
/*     If Play     */
			if (o.play > 0 && n > o.visible && o.step > 0 && typeof o.play === "number") {
				var auto;
/*     Stop when you hover on the carousel     */
				if (o.hoverStop) {
					next.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart()	
					});
					prev.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart()
					});
					s.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart()
					});
				}
				function playStart() {
					auto = setInterval(function () {
						if (animated === 0) {
							o.playBack ? back() : go();
						}
					}, o.play + o.speed);	
				}
				playStart();
			}
/*     Click Prev     */
			prev.click(function() { 
				if (animated === 0 && o.step > 0) {
					back(); 
				}
			});
			function back() {
				animated = 1;
				if (point == 0) {
					s.animate(o.vertical ? {top: "-="+ pEnd +"px"} : {left: "-="+ pEnd +"px"}, o.speed, o.easing, function() {
						refreshStep();
					});  
				} else {
					if (o.vertical) {
						step = (point + step > 0) ? -point : H * o.step;
					} else {
						step = (point + step > 0) ? -point : W * o.step;
					}
					s.animate(o.vertical ? {top: "+="+ step +"px"} : {left: "+="+ step +"px"}, o.speed, o.easing, function() {
						refreshStep();
					});
				}
			}
/*     Click Next     */
			next.click(function() { 
				if (animated === 0 && o.step > 0) {
					go(); 
				}
			});
			function go() { 
		   	animated = 1;
				if (point == -pEnd) {
					s.animate(o.vertical ? {top: 0} : {left: 0}, o.speed, o.easing, function() {
						refreshStep();
					}); 
				} else {
					if (o.vertical) { 
						step = (point-step < -pEnd) ? pEnd + point : H * o.step; 
					} else { 
						step = (point-step < -pEnd) ? pEnd + point : W * o.step; 
					}
					s.animate(o.vertical ? {top: "-="+ step +"px"} : {left: "-="+ step +"px"}, o.speed, o.easing, function() {
						refreshStep();
					}); 
				}
			}
			function refreshStep() {
				step = o.vertical ? H * o.step : W * o.step;
				point = o.vertical ? Math.round(s.position().top) : Math.round(s.position().left);
				animated = 0;
			}
			if (n <= o.visible) {
				next.hide();
				prev.hide();	
			}
		});
	};
})(jQuery)