(function(){
	'use strict';
	angular
		.module('finApp.directives',[])
		.directive('finHeader',finHeader)
		.directive('finDrawer',finDrawer)
		.directive('finCalendarForm',finCalendarForm)
		.directive('dropdown',dropdown);

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
    				setTimeout(function(){
    					$styledSelect.text(ngModel.$viewValue);
    				},0);    				
				    var $list = $('<ul />', {
				        'class': 'options'
				    }).insertAfter($styledSelect);
				    for (var i = 0; i < numberOfOptions; i++) {
				        $('<li />', {
				            text: $this.children('option').eq(i).text(),
				            rel: $this.children('option').eq(i).val()
				        }).appendTo($list);
				    }
				    var $listItems = $list.children('li');
				    $styledSelect.click(function (e) {
				        e.stopPropagation();
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
				    });
				    $(document).click(function () {
				        $styledSelect.removeClass('active');
				        $list.hide();
				    });
	    		}
	    	}
	    }

})();