/**
 * VCarousel-MOD - jQuery plugin to navigate images/any content in a carousel style widget.
 * @requires jQuery v1.7 or above
 *
 * http://www.web-viper.com/plugin/vcarousel/
 *
 * 2011/10/10 Sendetsky Vitaly (web-viper.com)
 * @author Sendetsky Vitaly/web.viper@yandex.ru
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Version: 2.0 ( Update 2012/04/03 )
 */
(function($){
	$.fn.VCarouselMOD = function(o) {   /*   ---  VCarouselMOD Options   ---   */
		o = $.extend({
			visible: 3,    /*    number of visible items carousel    */
			ID: 1,
			LBImgN: false,    /*    display numbering images    */
			LBcloseBtn: true,
			LBcaption: '',
			LBdesc: '',
			LBaddLink: '',
			LBloadImg: '',
			fading: false,
			fadingSpeed: o.fading ? 500 : 0,
			easing: null,
			LBeasing: null,/*    type animation    */
			step: 1,   /*    step animation    */
			play: null,  /*    playback carousel    */ 
			control: '',
			lightbox: false,   /*    lightbox true or false    */ 
			playBack: false,   /*    if true, play back animation    */ 
			hoverStop: true,   /*     Stop when you hover on the carousel     */
			btnPrev: 37,    /*     Ctrl + code button Prev     */
			btnNext: 39,    /*     Ctrl + code button Next     */
			speed: o.fading ? 0 : 500,
			LBspeed: 300,   /*     animation speed     */
			LBspeedFade: 300,
			prevId: '',   /*     You can specify the selector of the button Prev     */
			nextId: '',   /*     You can specify the selector of the button Next     */
			navNum: false,    /*     eh...     */
			navigation: '',
			navigationImg: false,
			prevText: 'Prev',    /*     Text on button Prev    */
			nextText: 'Next',    /*     Text on button Next    */
			LBprevText: 'Prev',    /*     Text on button Prev    */
			LBnextText: 'Next',
			navHidden: false,    /*     hide the navigation when the end or begin of the carousel    */
			vertical: false   /*     If true, the carousel will be the vertical   */
		}, o || {} );
		/*     Easing method    */
		$.extend($.easing, {
			easeInQuint: function (x, t, b, c, d) {
				return c * (t /= d) * t * t * t * t + b;
			},
			easeOutQuint: function (x, t, b, c, d) {
				if ((t /= d / 2) < 1) {
					return c / 2 * t * t * t * t * t + b;
				}
				return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
			},
			easeOutElastic: function (x, t, b, c, d) {
				var s = 1.70158,
					p = 0,
					a = c;
				if (t == 0) {
					return b;
				}
				if ((t /= d) == 1) {
					return b + c;  
				}
				if (!p) {
					p = d * .3;
				}
				if (a < Math.abs(c)) { 
					a = c; 
					var s = p / 4; 
				} else {
					var s = p / (2 * Math.PI) * Math.asin (c / a);
				}
				return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			},
			easeInOutElastic: function (x, t, b, c, d) {
				var s = 1.70158,
					p = 0,
					a = c;
				if (t == 0) {
					return b;  
				}
				if ((t /= d / 2) == 2) {
					return b + c;  
				}
				if (!p) {
					p = d * (.3 * 1.5);
				}
				if (a < Math.abs(c)) { 
					a = c; 
					var s = p / 4; 
				} else {
					var s = p / (2 * Math.PI) * Math.asin (c / a);
				}
				if (t < 1) {
					return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
				}
				return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
			},
			easeInBack: function (x, t, b, c, d, s) {
				if (s == undefined) {
					s = 1.70158;
				}
				return c * (t /= d) * t * ((s + 1) * t - s) + b;
			},
			easeOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) {
					s = 1.70158;
				}
				return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
			},
			easeInOutBack: function (x, t, b, c, d, s) {
				if (s == undefined) {
					s = 1.70158; 
				}
				if ((t /= d / 2) < 1) {
					return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
				}
				return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
			},
			easeInBounce: function (x, t, b, c, d) {
				return c - jQuery.easing.easeOutBounce (x, d - t, 0, c, d) + b;
			},
			easeOutBounce: function (x, t, b, c, d) {
				if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
				} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
				} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
				} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
				}
			},
			easeInOutBounce: function (x, t, b, c, d) {
				if (t < d / 2) {
					return jQuery.easing.easeInBounce (x, t * 2, 0, c, d) * .5 + b;
				}
				return jQuery.easing.easeOutBounce (x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
			}
		});
		return this.each(function () {
			var s = $(this), 
				prev, 
				next;
				n = s.children().length,   /*    number of elements in the carousel    */
				div_or_a = o.lightbox ? "<a href='#' class='vc-list-item-imgWrap' title='zoom' role='button'></a>" : "<div class='vc-list-item-imgWrap'></div>";
			if (o.vertical) {
				s.addClass("vc-list_vertical");
			} else {
				s.addClass("vc-list_horizontal");
			}
			if (o.visible <= 0 || typeof o.visible != "number") {
				o.visible = 1;
			}
			if (o.visible > n) {
				o.visible = n;
			}
			if (n <= o.visible) {
				o.navigation = null; 
			}
			if (o.play > 0 && o.play < 50) {
				o.play = 50;
			}
			s.addClass("vc-list")
				.attr("id","vc"+ o.ID)
				.find("img")
				.addClass("vc-list-item-imgWrap-image")
				.wrap(div_or_a)
			.end()
				.children()
				.addClass("vc-list-item");
			var W = s.children().outerWidth(true),
				H = s.children().outerHeight(true),
				num_prev = 0, 
				num_next = n - o.visible;		
/*     Auto fit all element and wrap to the carousel    */
			function fitH() {
				var height_full = [], 
					height_only = [];
				for (var i = n; i--;) {
					height_full[i] = s.children().eq(i).outerHeight(true);
					height_only[i] = s.children().eq(i).height();
					s.children()
						.eq(i)
						.attr("id", "vc"+ o.ID +"Element"+ (i + 1));
				}
				s.children().css("height", Math.max.apply(Math, height_only) +"px").attr("tabindex", "0");
				H = Math.max.apply(Math, height_full);
			}
			fitH();
			var pEnd = o.vertical ? (H * n) - (H * o.visible) : (W * n) - (W * o.visible);   /*     End position carousel    */
			s.css("width", o.vertical ? W +"px" : W * n +"px")
				.wrap("<div class='vc'></div>"); 
			s.parent().css({
				"float" : o.vertical ? 'none' : 'left',
				"width" : o.vertical ? W +"px" : (n < o.visible) ? W * n : W * o.visible +"px", 
				"height" : o.vertical ? (n < o.visible ? H * n : H * o.visible +"px") : H +"px"
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
			if (o.navNum) {
				prev.append("<span class='vcButton-rest'>"+ num_prev +"</span>");
				next.prepend("<span class='vcButton-rest'>"+ num_next +"</span>");
			}
		    function navNumChange() {
				prev.find(".vcButton-rest").text(num_prev);
				next.find(".vcButton-rest").text(num_next);
		    }
			prev.attr("aria-controls", "vc"+ o.ID);
			next.attr("aria-controls", "vc"+ o.ID);
			var point = o.vertical ? s.position().top : s.position().left,   /*     Stores the position of the carousel     */
				step = o.vertical ? H * o.step : W * o.step,   /*    Step animation     */
				stepN = o.vertical ? H : W;
/*     If Navigation     */		
			if (o.navigation != '' && typeof o.navigation === "string") {
				var nav = $(o.navigation), 
					navAdd = "";
				nav.addClass("vcNavigation");
				if (o.navigationImg) {
					for (var i = 1; i <= n; i++) {
						navAdd += "<li class='vcNavigation-item'><a class='vcNavigation-item-link vcNavigation-item-link_thumbnail' role='button' aria-controls='vc"+ o.ID +"Element"+ i +"' aria-selected='false' href='#' title='exchange to "+ i +"-st slide'><img class='vcNavigation-item-link-img' src='"+ s.children().eq(i-1).find(".vc-list-item-imgWrap-image").attr("src") +"' alt='' /></a></li>";
					}
				} else {
					for (var i = 1; i <= n; i++) {
						navAdd += "<li class='vcNavigation-item'><a class='vcNavigation-item-link' role='button' aria-controls='vc"+ o.ID +"Element"+ i +"' aria-selected='false' href='#' title='exchange to "+ i +"-st slide'>"+ i +"</a></li>";
					}
				}
				nav.append(navAdd);
				if (!nav.is("ul")) {
					nav.wrapInner("<ul></ul>");
				}
				if (n < o.visible) {
					for (var i = n; i--;) {
						nav.find("li:eq("+ i +")")
							.addClass("vcNavigation-item_active")
							.find("a").attr("aria-selected", "true");
					}
				}
				function navigate(num_prev) {
					nav.find("li")
						.removeClass("vcNavigation-item_active")
						.find("a").attr("aria-selected", "false");
					for (var i = o.visible; i--;) {
						nav.find("li:eq("+ (num_prev + i) +")").addClass("vcNavigation-item_active").find("a").attr("aria-selected", "true");
					}
				}
				navigate(num_prev);
				nav.find("li a").click(function(e) {
					if (animated === 0) {
						animated = 1;
						var navI = $(this).parent().index(),
							navGo = navI * stepN;
						if (navGo > pEnd) {
							navGo = pEnd;
							navI = n - o.visible;
						}
						function navigationGo() {
							s.animate(o.vertical ? {top: "-"+ navGo +"px"} : {left: "-"+ navGo +"px"}, o.speed, o.easing, function() {
								num_prev = navI;
								num_next = n - o.visible - navI;
								if (o.navNum) {
									navNumChange();
								}
								navigate(num_prev);
								if (o.fading) {
									s.fadeIn(o.fadingSpeed, function() { 
										navigationGoResult(); 
									});
								} else {
									navigationGoResult();
								}
								function navigationGoResult() {
									step = o.vertical ? H * o.step : W * o.step;
									point = o.vertical ? Math.round(s.position().top) : Math.round(s.position().left);
									checkNav();
									animated = 0;
								}
							});
						}
						if (o.fading) {
							s.fadeOut(o.fadingSpeed, function() {
								navigationGo();
							});
						} else {
							navigationGo();
						}
					}
					e.preventDefault();
				});
			}
			var animated = 0,   /*     Variable to test the animation carousel     */  
				lb_visible = 0,   /*     if active lightBox     */  
				lb_animated = 0,   /*     Variable to test the animation lightbox     */  
				control_check = 0, 
				time_play = o.play + o.speed + o.fadingSpeed * 2, 
				play_check = 0, 
				auto = null, 
				c;
/*     If Control     */
			if (o.control != '' && typeof o.control === "string" && n>o.visible) {
				function createdControl() {
					c = $(o.control);
					if (o.play > 0 && n > o.visible && o.step > 0 && typeof o.play === "number") {
						c.text("stop")
							.addClass("vcControlStop")
							.attr({"aria-controls": "vc"+ o.ID, "role": "button"});
					} else {
						c.text("play").addClass("vcControlPlay").attr({"aria-controls": "vc"+ o.ID, "role": "button"});
					}
				}
				createdControl();
				c.click(function(e) {
					if(c.is(".vcControlStop")) {
						stopControl();
					} else {
						if (typeof o.play != "number") { 
							o.play = 3000;
						}
						control_check = 0;
						playStart();
						c.text("stop")
							.removeClass("vcControlPlay")
							.addClass("vcControlStop");
					}
					e.preventDefault();
				});
				function stopControl() {
					clearInterval(auto);
					control_check = 1;
					c.text("play")
						.removeClass("vcControlStop")
						.addClass("vcControlPlay");
				}
			}
			if (o.control != '' && typeof o.control === "string" && n <= o.visible) {
				$(o.control).hide();
			}
/*     If Play     */
			if (o.play > 0 && n > o.visible && o.step > 0 && typeof o.play === "number") {
	/*     Stop when you hover on the carousel     */
				if (o.hoverStop) {
					next.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart();
					});
					prev.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart();
					});
					if (o.navigation != '' && typeof o.navigation === "string") {
						nav.hover(function() {
							clearInterval(auto);
						}, function() {
							playStart();
						});
					}
					s.hover(function() {
						clearInterval(auto);
					}, function() {
						playStart();
					});
				}
				function playStart() {
					if (animated === 0 && lb_visible === 0 && control_check === 0 && play_check === 0) {
						auto = setInterval(function () {
							if (animated === 0 && lb_visible === 0 && control_check === 0 && play_check === 0) {
								play_check = 1;	
								if (o.fading) {
									s.fadeOut(o.fadingSpeed, function() {
										o.playBack ? back() : go();
									});
								} else {
									o.playBack ? back() : go();
								}
							} else {
								clearInterval(auto);
							}
						}, time_play);
					}
				}
				playStart();
			}
/*     Click Prev     */
		    prev.click(function(e) { 
				if (animated === 0 && o.step > 0) {
					animated = 1;
					if (o.fading) {
						s.fadeOut(o.fadingSpeed, function() {
							back();
						});
					} else {
						back();
					}
				}
				e.preventDefault();
			});
		    function back() {
				animated = 1;
				if (point == 0) {
					s.animate(o.vertical ? {top: "-="+ pEnd +"px"} : {left: "-="+ pEnd +"px"}, o.speed, o.easing, function() {
						num_prev = n - o.visible; 
						num_next = 0;
						afterMove();
					});  
				} else {
					if (o.vertical) {
						step = (point + step > 0) ? -point : H * o.step;
					} else {
						step = (point + step > 0) ? -point : W * o.step;
					}
					s.animate(o.vertical ? {top: "+="+ step +"px"} : {left: "+="+ step +"px"}, o.speed, o.easing, function() {
						num_prev -= step / stepN;
						num_next += step / stepN;
						afterMove();
					});
				}
		    }
/*     Click Next     */
		    next.click(function(e) { 
				if (animated === 0 && o.step > 0) {
					if (o.fading) {
						s.fadeOut(o.fadingSpeed, function() {
							go();
						});
					} else {
						go();
					}
				}
				e.preventDefault();
		    });
		    function go() {
				animated = 1;
				if (point == -pEnd) {
					s.animate(o.vertical ? {top: 0} : {left: 0}, o.speed, o.easing, function() {
						num_prev = 0; 
						num_next = n - o.visible;
						afterMove();
					}); 
			    } else {
					if (o.vertical) { 
						step = (point - step < -pEnd) ? pEnd + point : H * o.step; 
					} else { 
						step = (point-step < -pEnd) ? pEnd + point : W * o.step; 
					}
					s.animate(o.vertical ? {top: "-="+ step +"px"} : {left: "-="+ step +"px"}, o.speed, o.easing, function() {
						num_prev += step / stepN;
						num_next -= step / stepN;
						afterMove();
					}); 
			    }
		    }
			function afterMove() {
				if (o.navNum) {
					navNumChange();
				}
				if (o.navigation != '' && typeof o.navigation === "string") {
					navigate(num_prev);
				}
				if (o.fading) {
					s.fadeIn(o.fadingSpeed, function() { 
						refreshStep(); 
					});
				} else {
					refreshStep();
				}
			}
			function refreshStep() {
				step = o.vertical ? H * o.step : W * o.step;
				point = o.vertical ? Math.round(s.position().top) : Math.round(s.position().left);
				checkNav();
				animated = 0;
				play_check = 0;
			}
		    if (n <= o.visible) {
				next.hide();
				prev.hide();	
			}
/*     If navHidden == true     */
			function checkNav() {
				if (o.navHidden) {
					if (point == 0) {
						prev.addClass("vcButton_hidden").attr("aria-hidden", "true");
					} else if (point == "-"+ pEnd) {
						next.addClass("vcButton_hidden").attr("aria-hidden", "true");  
						prev.removeClass("vcButton_hidden").attr("aria-hidden", "false");
					} else {
						prev.removeClass("vcButton_hidden").attr("aria-hidden", "false");
						next.removeClass("vcButton_hidden").attr("aria-hidden", "false");                                                     
					}
				}
			}
			checkNav();
			if (o.LBcaption != '' && typeof o.LBcaption === "string") {
				var LBcapArr = $.makeArray($(o.LBcaption));
			}
			if (o.LBaddLink != '' && typeof o.LBaddLink === "string") {
				var LBlinkArr = $.makeArray($(o.LBaddLink));
			}
			if (o.LBdesc != '' && typeof o.LBdesc === "string") {
				var LBdescArr = $.makeArray($(o.LBdesc));
			}
/*    -----   If LightBox == true    -----    */
			if (o.lightbox) {
				var img_number, 
					src, 
					img_width, 
					img_height, 
					vlb, 
					vlb_next = $(".vcLB-next"), 
					vlb_prev = $(".vcLB-prev"), 
					vlb_img;
				s.find(".vc-list-item-imgWrap").click(function(e) {
					var Ls = $(this),
						alt = Ls.parents("li")
							.find(o.LBloadImg)
							.attr("title") 
							|| Ls.find("img")
							.attr("alt"),
						top = $(document).scrollTop();
					img_number = Ls.parents("li").index();
					if (o.LBloadImg != '' && typeof o.LBloadImg === "string" && Ls.parents("li").has(o.LBloadImg).length > 0) {
						Ls.parents("li").find(o.LBloadImg).click(function() {
							return false;
						});
						src = Ls.parents("li").find(o.LBloadImg).attr("href");
						$("body").prepend("<img class='vcLBimg_preload' src='"+ src +"' alt='"+ alt +"' />");
						$(".vcLBimg_preload").css({
							"visibility": "hidden", 
							"position": "absolute", 
							"zIndex": "-99"
						});
						$(".vcLBimg_preload").load(function() {	
							LBcreated();
						});
					} else {
						src = Ls.find("img").attr("src");
						LBcreated();
					}
					
		/*     Create LightBox     */
					function LBcreated() {
						lb_visible = 1;
						lb_animated = 1;
						clearInterval(auto);
						$(".vcLBimg_preload").remove();
						$("body").prepend("<div class='vcLBoverlay'></div><figure class='vcLB' tabindex='0' role='dialog'><a href='#' role='button' title='previous slide' class='vcLB-prev'><span class='vcLB-prev-item'></span></a><img class='vcLB-image' src='"+ src +"' alt='"+ alt +"' /><a href='#' title='next slide' role='button' class='vcLB-next'><span class='vcLB-next-item'></span></a></figure>");
						if (n === 1) {
							$(".vcLB-prev, .vcLB-next").remove();
						}
						vlb = $(".vcLB"); 
						vlb_prev = $(".vcLB-prev"); 
						vlb_next = $(".vcLB-next");
						vlb_img = vlb.find("img");
						vlb_next.find("span").text(o.LBnextText);    /*     Text on LightBox button Next     */
						vlb_prev.find("span").text(o.LBprevText);    /*     Text on LightBox button Prev     */
						img_width = vlb_img.width();
						img_height = vlb_img.height();
						$(".vcLBoverlay").fadeIn(o.LBspeedFade);	
						vlb.animate({top: top +"px", width: img_width +"px", marginLeft: -(img_width / 2) +"px", height: img_height +"px"}, o.LBspeed, o.LBeasing, function() {
							lb_animated = 0;
						});	
						if (o.LBcloseBtn) {
							vlb.append("<div title='Close' class='vcLB-close' role='button'>X</div>");
						}
						if (o.LBImgN && n > 1) {	
							vlb.append("<p class='vcLB-number'>- <b></b> - [ <span></span> ] </p>");
							vlb.find(".vcLB-number b").text(img_number + 1);
							vlb.find(".vcLB-number span").text(n);
						}
						if (o.LBcaption != '' && typeof o.LBcaption === "string") {
							vlb.append("<div class='vcLB-caption'></div>");
							vlb.find(".vcLB-caption")
								.slideUp(0)
								.slideDown(o.LBspeedFade)
								.html($(LBcapArr[img_number])
									.clone());
						}
						if (o.LBaddLink != '' && typeof o.LBaddLink === "string") {
							vlb.append("<div class='vcLB-link'></div>");
							vlb.find(".vcLB-link")
								.slideUp(0)
								.slideDown(o.LBspeedFade)
								.html($(LBlinkArr[img_number])
									.clone());
						}
						if (o.LBdesc != '' && typeof o.LBdesc === "string") {
							vlb.append("<div class='vcLB-description'></div>");
							vlb.find(".vcLB-description")
								.fadeOut(0)
								.fadeIn(o.LBspeedFade)
								.html($(LBdescArr[img_number])
									.clone());
						}
						LBcontrols();
					}						
		/*     LightBox Navigation     */
					function LBcontrols() {
						$(".vcLB-prev, .vcLB-next").hover(function() {
							$(this).find("span").show();
						}, function() {
							$(this).find("span").hide();	
						});
						$(".vcLBoverlay, .vcLB-close").click(function() {
							finish();
						});
						vlb_prev.click(function(e) {
							if (lb_animated === 0) {
								lbBack();
							}
							e.preventDefault();
						});
						vlb_next.click(function(e) {
							if (lb_animated === 0) {
								lbGo(); 
							}
							e.preventDefault();
						});
					}
					$(window).keyup(function(e) { 
					if (e.keyCode === 27) {
							finish();	
						}
					});
	/*     LightBox Function Finish     */
					function finish() { 
						$(".vcLBoverlay, .vcLB").fadeOut(o.LBspeedFade, function() {
							$(this).remove();
						});
						lb_visible = 0;
						lb_animated = 0;
						if (o.play > 0 && n > o.visible && typeof o.play === "number" && control_check === 0 && play_check === 0) {
							clearInterval(auto);
							playStart();
						}
					}
	/*     End LightBox Function Finish     */
					e.preventDefault();
					     /*     Stopping carousel     */
				});	
				/*     If click Prev Img     */
				function refreshDataLB() {
					lb_animated = 1;
					if (o.LBloadImg != '' && typeof o.LBloadImg === "string" && s.children().eq(img_number).has(o.LBloadImg).length > 0) {
						src = s.children()
							.eq(img_number)
							.find(o.LBloadImg)
							.attr("href");
					} else {
						src = s.children()
							.eq(img_number)
							.find("img")
							.attr("src");
					}
					vlb.find(".vcLB-caption").slideUp(o.LBspeedFade);
					vlb.find(".vcLB-link").slideUp(o.LBspeedFade);
					vlb.find(".vcLB-description").fadeOut(o.LBspeedFade);
					vlb_img.fadeOut(o.LBspeedFade,function() {
						vlb_img.one("load", function() {
							img_width = vlb_img.width();
							img_height = vlb_img.height();
							vlb.animate({width: img_width +"px", marginLeft: -(img_width / 2) +"px", height: img_height +"px"}, o.LBspeed, o.LBeasing, function() {
								if (o.LBImgN) {
									$(".vcLB-number b").text(img_number + 1);
								}
								if (o.LBcaption != '' && typeof o.LBcaption === "string") {
									vlb.find(".vcLB-caption")
										.slideDown(o.LBspeedFade)
										.html($(LBcapArr[img_number])
											.clone());
								}
								if(o.LBaddLink != '' && typeof o.LBaddLink === "string") {
									vlb.find(".vcLB-link")
										.slideDown(o.LBspeedFade)
										.html($(LBlinkArr[img_number])
											.clone());
								}
								if(o.LBdesc != '' && typeof o.LBdesc === "string") {
									vlb.find(".vcLB-description")
										.fadeIn(o.LBspeedFade)
										.html($(LBdescArr[img_number])
											.clone());
								}
								vlb_img.fadeIn(o.LBspeedFade, function() {
									lb_animated = 0;
								});
							});
						}).attr("src", src);
					});
				}
				function lbBack() { 
					(img_number - 1 < 0) ? img_number = n - 1 : img_number -= 1;
					refreshDataLB();	
				}
					/*    If click Next Img     */
				function lbGo() { 
					(img_number + 1 > n - 1) ? img_number = 0 : img_number += 1;
					refreshDataLB();	
				}  
			}
/*    -----   LightBox == END    -----    */
			if (o.btnPrev != '' || o.btnNext != '') {
		   /*     Control Keys     */
			var isCtrl = false;
			$(window).keyup(function(e) { 
				if (e.which === 17) {
					isCtrl = false; 
				}
				}).keydown(function(e) {
					if (e.which === 17) {
						isCtrl=true;
					}
					if (e.which === o.btnPrev && isCtrl == true) {
						if (o.play && c.is(".vcControlStop")) {
							stopControl();
						}
						if (lb_visible === 1) {
							if (lb_animated === 0) {
								lbBack();
							}
						} else {
							if (animated === 0 && o.step > 0) {
								if (o.fading) {
									s.fadeIn(o.fadingSpeed, function() {
										back();
									});
								} else {
									back();
								}
							}
						}
					} else if (e.which === o.btnNext && isCtrl == true) {
						if (o.play && c.is(".vcControlStop")) {
							stopControl();
						}
						if (lb_visible === 1) {
							if (lb_animated === 0) {
								lbGo();	
							}
						} else {
							if (animated === 0 && o.step > 0) {
								if (o.fading) {
									s.fadeOut(o.fadingSpeed, function() {
										go();
									});
								} else {
									go();
								}
							}
						}
					}
				});
			}
		});
	};
})(jQuery)