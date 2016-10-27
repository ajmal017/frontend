(function(){
	'use strict';
	angular
		.module('finApp.directives',[])
		.directive('finHeader',finHeader)
		.directive('finDrawer',finDrawer)
		.directive('finCalendarForm',finCalendarForm);

		function finHeader(){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/header.html',
				link: function($scope,$element,$attr){
					 $('.menu,.drawer-overlay,.close-value').on('click',function(){
				        drawerAnimate();
				    });
				}
			};			
		}

		function finDrawer(){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/drawer.html',
				link:function(){
					$('.close-value').on('click',function(){
				        drawerAnimate();
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
					max : '='
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

})();