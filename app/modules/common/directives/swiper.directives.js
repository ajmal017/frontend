(function(){
	'use strict';
	angular
		.module('finApp.directives')
		.directive('swiper',swiper);

		swiper.$inject = ['$rootScope','$location','$compile'];
		function swiper($rootScope,$location,$compile){
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
	                result : '=',
	                callModel: '&callmodalFn'
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
			                calculateHeight:true,
			                nextButton: '.content-next',
                			prevButton: '.content-prev',
                			onInit : function(swiper){
                				var mainSwiperHeight = $('.'+scope.swiperName).outerHeight();
								var activeSlide = swiper.slides.eq(swiper.activeIndex);
								var height = $(activeSlide).find('.swiper-content').outerHeight() + 50;
								var applyHeight = height - 100;
								 $('.'+scope.swiperName).css('height', applyHeight);
        						 $('.'+scope.swiperName+'.swiper-wrapper').css('height', applyHeight);
        						 $('.swiper-slide').css('height', '450px');
        						 if(mainSwiperHeight < height){
        						 	$(activeSlide).css('height', applyHeight);
        						 }else{
        						 	$('.'+scope.swiperName).css('height','450px');
        						 }							
                			},
			                onSlideChangeEnd: function(swiper){
			                	$rootScope.lastSlide = true;
								if(!$rootScope.$$phase)	$rootScope.$apply();
								var mainSwiperHeight = $('.'+scope.swiperName).outerHeight();
								var activeSlide = swiper.slides.eq(swiper.activeIndex);
								var height = $(activeSlide).find('.swiper-content').outerHeight() + 50;
								var applyHeight = height - 50;
								 $('.'+scope.swiperName).css('height', applyHeight);
        						 $('.'+scope.swiperName+'.swiper-wrapper').css('height', applyHeight);
        						 $('.swiper-slide').css('height', '450px');
        						 if(mainSwiperHeight < height){
        						 	$(activeSlide).css('height', applyHeight);
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
                    scope.test = function(){
                    	swiper.slideTo(swiper.activeIndex - 1);
                    }
                    scope.gotoMoreQuestion = function(){
                    	$location.path('riskAssesmentMoreQuestions');                    	
                    }
                    scope.appendValues = function(param){
                    	scope.currentViewValue = param;
                    }
                    scope.decrementStep = function(){
                    	alert('dfdf');
                    	scope.step = scope.step - 1;
                    	if(!scope.$$phase)	scope.$apply(); 
                    }
	            }
			};
		}
})();


