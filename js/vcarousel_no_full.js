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
 * Version: 1.0 beta
 */
(function($){
   $.fn.VCarousel = function(o) {   /*   ---  VCarousel Options   ---   */
      o = $.extend({
		 width: 240,   /*     width each element carousel    */
		 heightImg: 140,   /*     max. height of the each image    */
		 alignImg: true,   /*     alignment of the image center    */
		 marginRight: 10,   /*    left margin each element for horizontal carousel    */
		 marginBottom: 10,   /*    bottom margin each element for vertical carousel    */
		 visible: 3,    /*    number of visible items carousel    */
		 easing: null,    /*    type animation    */
		 step: 1,   /*    step animation    */
		 play: 3000,  /*    playback carousel    */  
		 playBack: false,   /*    if true, play back animation    */ 
		 hoverStop: true,   /*     Stop when you hover on the carousel     */
		 speed: 500,    /*     animation speed     */
		 prevId: '',   /*     You can specify the selector of the button Prev     */
		 nextId: '',   /*     You can specify the selector of the button Next     */
		 prevText: '<< Prev',    /*     Text on button Prev    */
		 nextText: 'Next >>',    /*     Text on button Next    */
		 navHidden :false,    /*     hide the navigation when the end or begin of the carousel    */
		 vertical: false,   /*     If true, the carousel will be the vertical   */
		 border: '3px solid #4281B7',    /*    border each element carousel    */
		 zIndex: '98'   /*    css z-index for carousel    */
      }, o || {}); 
      return this.each(function () {
		   var s = $(this);
		   var n = s.find("li").length;   /*    number of elements in the carousel    */
		   s.children("li").css({"float":o.vertical ? 'none' : 'left',"border":o.border,"width":o.width+"px","margin-right":o.vertical ? 'none' : o.marginRight+"px","margin-bottom":o.vertical ? o.marginBottom+"px" : 'none'});
		   s.find("img").attr("width",o.width).css({"vertical-align":o.alignImg ? 'middle' : 'top'}).wrap("<div class='carousel-img-wrap'></div>");
		   s.find(".carousel-img-wrap").css({"overflow":"hidden","height":o.heightImg+"px","width":"100%", "text-align":o.alignImg ? 'center' : 'left',"vertical-align":o.alignImg ? 'middle' : 'top',"line-height":o.alignImg ? o.heightImg*0.92+"px" : 0});
		   var wEl = s.find("li").outerWidth(true);
/*     Auto fit all element and wrap to the carousel    */		   
		   var hEl= s.find("li").outerHeight(true);
		   var heli= s.find("li").height();
		   var hi, hNel;
		   for(var i=0;i<n;i++)
		   {
			   hNel = s.find("li:eq("+i+")").height();
			   hi = s.find("li:eq("+i+")").outerHeight(true);
			   if(hi>hEl){hEl=hi;}
			   else {hEl = hEl;}
			   if(hNel>heli){heli=hNel;}
			   else {heli = heli;}
		   }
		   s.children("li").css("height",heli+"px");
		   var pEnd = o.vertical ? (hEl*n) - (hEl*o.visible) : (wEl*n) - (wEl*o.visible);   /*     End position carousel    */
           s.css({"position":"absolute","padding":"0","margin":"0","list-style":"none outside none","left":"0","top":"0","width":o.vertical ? wEl+"px" : wEl*n+"px"}).wrap("<div class='carousel-wrap'></div>"); 
		   s.parent(".carousel-wrap").css({"overflow":"hidden","float":o.vertical ? 'none' : 'left',"position":"relative","z-index":o.zIndex,"width":o.vertical ? wEl+"px" : wEl*o.visible-o.marginRight+"px","height":o.vertical ? hEl*o.visible-o.marginBottom+"px" : hEl+"px"});
/*     If have ID button Prev    */
		   if(o.prevId!='')
		   {
				var prev = $(o.prevId);   
		   }
		   else
		   {
			    s.parent(".carousel-wrap").before("<button class='carousel-prev'></button>");
				$(".carousel-prev").css({"float":o.vertical ? 'none' : 'left',"position":"relative","cursor":"pointer"});
				var prev = $(this).parent(".carousel-wrap").prev();
				prev.text(o.prevText);   /*     Text on button Prev     */
		   }
/*     If have ID button Next    */
		   if(o.nextId!='')
		   {
				var next = $(o.nextId);   
		   }
		   else
		   {
			    $(this).parent(".carousel-wrap").after("<button class='carousel-next'></button>");
				$(".carousel-next").css({"float":o.vertical ? 'none' : 'left',"position":"relative","cursor":"pointer"});
				var next = $(this).parent(".carousel-wrap").next();
				next.text(o.nextText);   /*     Text on button Next     */
		   }
		   var point = o.vertical ? s.position().top : s.position().left;   /*     Stores the position of the carousel     */
		   var step = o.vertical ? hEl*o.step : wEl*o.step;   /*    Step animation     */
		   var stepN = o.vertical ? hEl : wEl;
		   var t = 0;   /*     Variable to test the animation carousel     */
		   var l = 0;   /*     if active lightBox     */
		   var a = 0;   /*     Variable to test the animation lightbox     */
		   var auto;
/*     If Play     */
		   if(o.play)
		   	{
				auto = setInterval(function () {
					o.playBack ? back() : go();
				}, o.play+o.speed); 
	/*     Stop when you hover on the carousel     */
				if(o.hoverStop)
					{
					next.hover(function(){
						clearInterval(auto);
					}, function(){
						if(l==0){
							auto = setInterval(function () {
							o.playBack ? back() : go();
						}, o.play+o.speed);	
						}
					});
					prev.hover(function(){
						clearInterval(auto);
					}, function(){
						if(l==0){
						auto = setInterval(function () {
							o.playBack ? back() : go();
						}, o.play+o.speed);	
						}
					});
					s.hover(function(){
						clearInterval(auto);
					}, function(){
						if(l==0){
						auto = setInterval(function () {
							o.playBack ? back() : go();
						}, o.play+o.speed);	
						}
					});
					}
			}
/*     Click Prev     */
		   prev.click(function(){ if(t==0){back();}else {return false;} });
		   function back() {
			   t = 1;
			   if(point==0)    /*       rewind to the end      */
				   {
						s.animate(o.vertical?{top:"-="+pEnd+"px"}:{left:"-="+pEnd+"px"}, o.speed,o.easing, function(){
							t = 0;
							point = o.vertical ? s.position().top : s.position().left;
						});  
				   }
			   else    /*       step back      */
				   {
					   if(o.vertical) step = (point+step > 0) ? -point : hEl*o.step;
					   else step = (point+step > 0) ? -point : wEl*o.step;
					   s.animate(o.vertical?{top:"+="+step+"px"}:{left:"+="+step+"px"}, o.speed,o.easing,function(){
						    t = 0;
							next.css("visibility","visible");
							step = o.vertical ? hEl*o.step : wEl*o.step;
							point = o.vertical ? s.position().top : s.position().left;
							checkNav();
						});
				   }
		   }
/*     Click Next     */
		   next.click(function(){ if(t==0){go();}else {return false;} });
		   function go() { 
		   	t = 1;
			   if(point == -pEnd)    /*      rewind to the beginning      */
			   {
					s.animate(o.vertical ? {top:0} : {left:0}, o.speed,o.easing, function(){
						t = 0;
						point = o.vertical ? s.position().top : s.position().left;
					}); 
			   }
			   else     /*       step forward      */
			   {
					if(o.vertical) { step = (point-step < -pEnd) ? pEnd + point : hEl*o.step; }
					else { step = (point-step < -pEnd) ? pEnd + point : wEl*o.step; }
					s.animate(o.vertical?{top:"-="+step+"px"}:{left:"-="+step+"px"}, o.speed,o.easing,function(){
						t = 0;
						prev.css("visibility","visible");
						step = o.vertical ? hEl*o.step : wEl*o.step;
						point = o.vertical ? s.position().top : s.position().left;
						checkNav();
					}); 
			   }
		   }
		   
		   if(n<=o.visible) 
			{
				next.css("visibility","hidden");
				prev.css("visibility","hidden");	
			}
/*     If navHidden == true     */
		   function navDel(){
			   if(point==0)
			   {
					prev.css("visibility","hidden"); 
					
			   }
			   else if(point == "-"+pEnd)
			   {
					next.css("visibility","hidden");    
			   }
			}
		   function checkNav(){
			   if(o.navHidden)
			   {
			   	   navDel();
		   	   }
		   }
		   checkNav();
      });
   };
})(jQuery)