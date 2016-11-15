(function(){
	'use strict';
	angular
		.module('finApp.directives',[])
		.directive('clickRedirect',clickRedirect)
		.directive('finHeader',finHeader)
		.directive('finDrawer',finDrawer)
		.directive('finCalendarForm',finCalendarForm)
		.directive('dropdown',dropdown)
		.directive('onlyNumber',onlyNumber)
		.directive('validatePassword',validatePassword)
		.directive('checkPassword',checkPassword);

		clickRedirect.$inject = ['$location','$rootScope'];
	    function clickRedirect($location,$rootScope) {
	        var directive = {
	            link: link,
	            restrict: 'EA'
	        };
	        return directive;

	        function link($scope, $element, $attrs) {
	            $element.on('click', function() {
	                $location.path($attrs.clickRedirect);
	                $scope.$apply();
	            });
	        }
	    }
	    
	    finHeader.$inject = ['$rootScope'];
		function finHeader($rootScope){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/header.html',
				link: function($scope,$element,$attr){
					 $('.menu,.drawer-overlay,.close-value').on('click',function(){
				         $rootScope.drawerAnimate();
				    });
				}
			};			
		}

		finDrawer.$inject = ['$rootScope'];
		function finDrawer($rootScope){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/drawer.html',
				link:function(){
					$('.close-value').on('click',function(){
				         $rootScope.drawerAnimate();
				    });
				}
			};
		}

		var drawerAnimate = function(){
	        $('.drawer').toggleClass('open');
	        $('.drawer-overlay').toggleClass('open');
	        $('.page-wrapper').toggleClass('open');
	        $('.bar1,.bar2').toggleClass('open');
	    };

	    function finCalendarForm(){
	    	return{
				restrict : 'EA',
				require:'ngModel',
				replace:false,
				scope : {
					type : '@',
					min : '=',
					max : '=',
					format : '@'
				},
				templateUrl:'modules/common/views/partials/calendar.html',
				link:function($scope,$element,$attr,ngModel){
					var model = null;
					if (!ngModel) return; 
					ngModel.$render = function(){
						$scope.model = ngModel.$viewValue || 0;
						model = ngModel.$viewValue || 0;
					}
					$scope.doDecrement = function(){
						var min = parseInt($scope.min);
						if(min <  model){
							model = model - 1;
							ngModel.$setViewValue($scope.model);
							$scope.model = model;
						}else{
							ngModel.$setViewValue(min);
							model = min;
							$scope.model = min;
						}								
					}
					$scope.doIncrement = function(){
						var max = parseInt($scope.max);
						if(max > model){
							model = model + 1;
							$scope.model = model;
							ngModel.$setViewValue($scope.model);
						}
							
					}

					$element.find('input').on('keyup',function(e){
						var ref = $(this).val();
						ref = ref.replace(/[^0-9]/g, '');
						$scope.model = parseInt(ref) || 0;
						model = parseInt(ref)||0;
						if(model > parseInt($scope.max)){
							$scope.model = parseInt($scope.max);
							model = parseInt($scope.max);
						}else if(model < parseInt($scope.min)){
							$scope.model = parseInt($scope.min);
							model = parseInt($scope.min);
						}
						$scope.$apply();					
					})
				}
			};
	    }

	    function onlyNumber(){
	    	return{
	    		restrict : 'A',
	    		require : 'ngModel',
	    		link : function($scope,$element,$attr,ngModel){
	    			ngModel.$parsers.unshift(function(value) {
	    				value = value.replace(/[^0-9]/g, '');
	    				ngModel.$setViewValue(value);
                		ngModel.$render();
                		return value;
	    			});
	    		}
	    	}
	    }

	    function dropdown(){
	    	return{
	    		restrict : 'EA',
	    		require : 'ngModel',
	    		link : function($scope,$element,$attr,ngModel){
	    			var $this = $element,
        			numberOfOptions = $this.children('option').length;
    				$this.addClass('s-hidden');
    				$this.wrap('<div class="select"></div>');
    				$this.after('<div class="styledSelect"></div>');
    				var $styledSelect = $this.next('div.styledSelect');   				
				    var $list = $('<ul />', {
				        'class': 'options'
				    }).insertAfter($styledSelect);
				    for (var i = 0; i < numberOfOptions; i++) {
				        $('<li />', {
				            text: $this.children('option').eq(i).text(),
				            rel: $this.children('option').eq(i).val()
				        }).appendTo($list);
				        $styledSelect.text($this.children('option[selected]').text());
				        ngModel.$setViewValue($this.children('option[selected]').val());
				    }
				    var $listItems = $list.children('li');
				    $styledSelect.click(function (e) {
				        e.stopPropagation();
				        $('.customSwiper .fin-btn-group').css('z-index',0);
				        $('div.styledSelect.active').each(function () {
				            $(this).removeClass('active').next('ul.options').hide();
				        });
				        $(this).toggleClass('active').next('ul.options').toggle();
				    });
				    $listItems.click(function (e) {
				        e.stopPropagation();
				        $styledSelect.text($(this).text()).removeClass('active');
				        $this.val($(this).attr('rel'));
				        ngModel.$setViewValue($(this).attr('rel'));
				        $list.hide();
				        $('.customSwiper .fin-btn-group').css('z-index',1000);
				    });
				    $(document).click(function () {
				        $styledSelect.removeClass('active');
				        $('.customSwiper .fin-btn-group').css('z-index',1000);
				        $list.hide();
				    });
	    		}
	    	}
	    }

		function validatePassword() {
		    return {
				restrict : 'EA',
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel) {
					if(!ngModel) return;
					function validate(value){
						var valid = (value === scope.$eval(attrs.validatePassword));
						ngModel.$setValidity('equal', valid);
						return valid ? value : undefined;
					}
					ngModel.$parsers.push(validate);
					ngModel.$formatters.push(validate);
				}
		    };
		}
		// /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
		function checkPassword(){
			return {
				restrict : 'EA',
				require: 'ngModel',
				link: function(scope, element, attrs, ngModel) {
					if(!ngModel) return;
					ngModel.$setValidity('oneNumber',false);
					ngModel.$setValidity('oneUpper',false);
					ngModel.$setValidity('oneSmall',false);
					ngModel.$setValidity('minlength',false);
					scope.reset = true;
					function validate(value){
						if(value){
							scope.reset = false;
							var atleastOneNumber = /^(?=.*\d)/.test(value);
							ngModel.$setValidity('oneNumber',atleastOneNumber);
							var atleastOneUpper = /^(?=.*[A-Z])/.test(value);
							ngModel.$setValidity('oneUpper',atleastOneUpper);
							var atleastOneSmall = /^(?=.*[a-z])/.test(value);
							ngModel.$setValidity('oneSmall',atleastOneSmall);
							var minlength = /^[0-9a-zA-Z]{8,}/.test(value);
							ngModel.$setValidity('minlength',minlength);
							return value;
						}else{
							scope.reset = true;
							ngModel.$setValidity('oneNumber',false);
							ngModel.$setValidity('oneUpper',false);
							ngModel.$setValidity('oneSmall',false);
							ngModel.$setValidity('minlength',false);
						}					
						console.log("Number--"+atleastOneNumber+"One Upper"+atleastOneUpper+"One Small"+atleastOneSmall+""+minlength);
					}
					ngModel.$parsers.push(validate);
					ngModel.$formatters.push(validate);
				}
		    };
		}
})();