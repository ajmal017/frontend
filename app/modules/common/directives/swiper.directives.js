(function(){
	'use strict';
	angular
		.module('finApp.directives')
		.directive('swiper',swiper);

		swiper.$inject = ['$rootScope','$location'];
		function swiper($rootScope,$location){
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
	                swiperFallback: '@',
	                indicatorEnd:'@',
	                sendValues: '&callbackFn',
	                result : '='
	            },
	            link: function(scope, element, attrs) {
	                scope.defaultslidesPerView = 1;
	                scope.defaultspaceBetween = 0;
	                scope.swiperName = attrs.swiperName;
	                $rootScope.lastSlide = true;
	                var swiper = null;
	                scope.modelVal = {};
	                setTimeout(function() {
                        swiper = $(element).find("." + scope.swiperName).swiper({
			                direction : 'vertical',
			                slidesPerView : 1,
			                loop: false,
			                simulateTouch:false,
			                nextButton: '.content-next',
                			prevButton: '.content-prev',
			                onSlideChangeEnd: function(swiper){
			                	$rootScope.lastSlide = true;
								if(!$rootScope.$$phase)	$rootScope.$apply();
			                	var mainSwiperHeight = $('.'+scope.swiperName).outerHeight();
			                	var sliderHeight = $('.'+scope.swiperName+' .swiper-slide-active .swiper-content').outerHeight();
			                	if(mainSwiperHeight < sliderHeight){
			                		$('.'+scope.swiperName).css('height',sliderHeight);
			                	}else{
			                		$('.'+scope.swiperName).css('height','450px');
			                	}
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
								      if((swiper.slides.length - 1) == (swiper.activeIndex)){
								      	$('.'+scope.swiperName+' .bubble .dot-cover').eq(i).next()
								      	.attr('data-content',scope.indicatorEnd);
								      	$rootScope.lastSlide = false;
								      	if(!$rootScope.$$phase)	$rootScope.$apply(); 
								      }				      
								    }else{
								       $('.'+scope.swiperName+' .bubble .dot-cover').eq(i).find('.dot').removeClass('ani');
								       $('.'+scope.swiperName+' .bubble .dot-cover').eq(0).find('.dot').addClass('active');
								       if(swiper.activeIndex == 0){
								       	$('.'+scope.swiperName+' .bubble .dot-cover').eq(0).addClass('showPseudo');
								       }
								    } 
  								}
  								if((swiper.slides.length - 1) == (swiper.activeIndex)){
  									scope.sendValues({'data':JSON.stringify(scope.currentViewValue)});
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
                    scope.gotoFirst = function(param){
                    	scope.modelVal = {};
                    	scope.result = 0;
                    	setTimeout(function(){
                    		swiper.slideTo(param,0,true);
                    	},0)                    	
                    }
                    scope.gotoMoreQuestion = function(){
                    	$location.path('riskAssesmentMoreQuestions');                    	
                    }
                    scope.appendValues = function(param){
                    	scope.currentViewValue = param;
                    }
	            }
			};
		}
})();


