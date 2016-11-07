(function(){
	'use strict';
	angular
		.module('finApp.directives')
		.directive('swiper',swiper);

		function swiper(){
			return{
				replace:false,
				templateUrl:'modules/common/views/partials/swiper.html',
				restrict: 'EA',
	            scope: {
	                swiperName: '@',
	                swiperNext: '@',
	                swiperPrev: '@',
	                swiperWidth: '@',
	                swiperPage: '@',
	                swiperSection: '@',
	                swiperFallback: '@'
	            },
	            link: function(scope, element, attrs) {
	                scope.defaultslidesPerView = 1;
	                scope.defaultspaceBetween = 0;
	                scope.swiperName = attrs.swiperName;
	                setTimeout(function() {
                        var swiper = $(element).find("." + scope.swiperName).swiper({
			                direction : 'vertical',
			                simulateTouch:true,
			                nextButton: '.content-next',
                			prevButton: '.content-prev',
			                onSlideChangeEnd: function(swiper){
  								$('.'+scope.swiperName+' .dot').removeClass('active');
  								$('.'+scope.swiperName+' .bubble .dot-cover').removeClass('showPseudo');
  								for(var i=0;i<=swiper.slides.length;i++){
  									if(i < swiper.activeIndex){
								      $('.'+scope.swiperName+' .bubble .dot-cover').eq(i).find('.dot').addClass('ani');
								      $('.'+scope.swiperName+' .bubble .dot-cover').eq(i).next().find('.dot').addClass('active');
								      if((i+1) == swiper.activeIndex){
								      	$('.'+scope.swiperName+' .bubble .dot-cover').eq(i).next()
								      	.attr('data-content', 'Step '+(((i+2)<10)?'0'+(i+2):(i+2))).addClass('showPseudo');
								      } 					      
								    }else{
								       $('.'+scope.swiperName+' .bubble .dot-cover').eq(i).find('.dot').removeClass('ani');
								       $('.'+scope.swiperName+' .bubble .dot-cover').eq(0).find('.dot').addClass('active');
								       if(swiper.activeIndex == 0){
								       	$('.'+scope.swiperName+' .bubble .dot-cover').eq(0).addClass('showPseudo');
								       }
								    } 
  								}
			                }
			            });
			            var div = $('<div/>', {
						    class: 'bubble'
						});
			            div.appendTo($(element).find("." + scope.swiperName));
			            for(var i=0;i<swiper.slides.length;i++){
			            	var divDotCover = $('<div/>',{
			            		class : (i == 0)?'dot-cover showPseudo':'dot-cover'	,
			            		'data-content' : (i == 0)?'Step 01':''
			            	});
			            	var divDot = $('<div/>',{
			            		class : (i == 0)?'dot active':'dot'			            		
			            	});
			            	divDot.appendTo(divDotCover)
			            	divDotCover.appendTo(div);
			            }         
                    }, 200);	                
	            }
			};
		}
})();


