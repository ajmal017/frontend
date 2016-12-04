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
		.directive('checkPassword',checkPassword)
		.directive('showTip',showTip)
		.directive('infoTip',infoTip)
		.directive('format',format)
		.directive('calculateGuage',calculateGuage)
		.directive('validatePan',validatePan)
		.directive('bubbleGen',bubbleGen)
		.directive('hcChart',hcChart)
		.directive('investPieChart',investPieChart)
		.directive('schemeChart',schemeChart)
		.directive('customScrollBar',customScrollBar)
		.directive('accordian',accordian);

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
					formatSymbol : '@',
					fontColor:'@',
					yearMax : '@',
					year : '@'
				},
				templateUrl:'modules/common/views/partials/calendar.html',
				link:function($scope,$element,$attr,ngModel){
					var model = null;
					if (!ngModel) return; 
					ngModel.$render = function(){						
						if($scope.year == 'true'){
							var currentDate = new Date();
							var currentYear = currentDate.getFullYear();
							$scope.max = currentYear + parseInt($scope.yearMax);
							$scope.min = currentYear + 1;
							model = $scope.min;
							$scope.model = $scope.min;
							ngModel.$setViewValue($scope.model);
						}else{
							$scope.model = ngModel.$viewValue || 0;
							model = ngModel.$viewValue || 0;
							ngModel.$setViewValue($scope.model);
						}
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
						ngModel.$setViewValue($scope.model);
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

	    dropdown.$inject = ['$compile'];
	    function dropdown($compile){
	    	return{
	    		restrict : 'EA',
	    		require : 'ngModel',
	    		link : function($scope,$element,$attr,ngModel){
	    			setTimeout(function(){
	    				var $this = $element,
        			numberOfOptions = $this.children('option').length;
    				$this.addClass('s-hidden');
    				$this.wrap('<div class="select"></div>');
    				$this.after('<div class="styledSelect"></div>');
    				var $styledSelect = $this.next('div.styledSelect');   				
				    var $list = $('<ul />', {
				        'class': 'options',
				    }).insertAfter($styledSelect);
				    var compiled = $compile($list)($scope);
				    for (var i = 0; i < numberOfOptions; i++) {
				        $('<li />', {
				            text: $this.children('option').eq(i).text(),
				            rel: $this.children('option').eq(i).val()
				        }).appendTo($list);
				        $styledSelect.text($this.children('option[selected]').text());
				        ngModel.$setViewValue($this.children('option[selected]').val());
				    }
				    var $listItems = $list.children('li');
				    $listItems.eq(0).remove();			    
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
				    if(parseInt($list.outerHeight()) > 400){
				    	$this.parent().find('.options').mCustomScrollbar({setHeight:300,axis:"y"});
				    }
				    console.log($attr['scrollHeight']);
				    if($attr['scrollHeight'] != undefined){
				    	$this.parent().find('.options').mCustomScrollbar({setHeight:parseInt($attr['scrollHeight']),axis:"y"})
				    }				    		    
				},0);	    			
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

		infoTip.$inject = [];
		function infoTip(){
			return{
				restrict : 'EA',
			 	templateUrl:'modules/common/views/partials/info.html',
			 	scope : {
			 		quickTipData : '=',
			 		infoWidth : '@',
			 		className:'@'
			 	},
			 	link: function (scope, element, attrs) {
			 		element.find('.infoTip').addClass('hide');	
			 		element.find('.info-tip-outer-cover').addClass(scope.className);
			 		element.find('.infoImage').bind({
			 			'click':function(){
			 				if(element.find('.infoTip').hasClass('show')){
			 					element.find('.infoTip').addClass('bounceOut').removeClass('bounceIn show');
			 				}else{
			 					element.find('.infoTip').addClass('show bounceIn').removeClass('hide bounceOut');
			 				}			 				
			 			}
			 		});	 		
			 	}
			}
		}

		showTip.$inject = [];
		function showTip(){
			 return {
			 	restrict : 'EA',
			 	templateUrl:'modules/common/views/partials/tip.html',
			 	scope : {
			 		quickTipData : '='
			 	},
			 	link: function (scope, element, attrs) {
			 		element.find('.message').addClass('hide');
			 		element.find('.tip').bind({
			 			'click':function(){
			 				if(element.find('.message').hasClass('show')){
			 					element.find('.message').addClass('bounceOut').removeClass('bounceIn show');
			 				}else{
			 					element.find('.message').addClass('show bounceIn').removeClass('hide bounceOut');
			 				}			 				
			 			}
			 		})
			 	}
			 }
		}

		format.$inject = ['$filter'];
		function format($filter){
			 return {
		        require: '?ngModel',
		        link: function (scope, elem, attrs, ctrl) {
		            if (!ctrl) return;
		            // ctrl.$formatters.unshift(function (a) {
		            //     return $filter(attrs.format)(ctrl.$modelValue)
		            // });

		            ctrl.$parsers.unshift(function (viewValue) {
		                console.log(viewValue);
		                if(viewValue){
		                    var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
		                    elem.val($filter('number')(plainNumber));
		                    return plainNumber;
		                }else{
		                    return '';
		                }
		            });
		        }
		    };
		}
		function calculateGuage(){
			return{
				restrict : 'EA',
				link : function(scope, element, attrs){
					var equityValue = attrs['oneTimeEquity'];
					// equityValue = equityValue.replace('%','');
					var arcPercentage = (180/100)*equityValue;
					var arcPos = arcPercentage - 45;
					element.find('.orbit').css('transform','rotate('+arcPos+'deg)');
					var textTop = element.find('.indicator').position().top;
					var textLeft = element.find('.indicator').position().left;
					element.find('h4').css({
						'top' : textTop + 35,
						'left': textLeft + 70
					});
					attrs.$observe('calculateGuage', function () {
		                var changedValue = attrs['calculateGuage'];
		                // changedValue = changedValue.replace('%','');
						var poniterPercentage = (180/100)*changedValue;
						var pointerPos = poniterPercentage - 90;
						element.find('.pointer').css('transform','rotate('+pointerPos+'deg)');
		            });
				}
			}
		}

		validatePan.$inject=['$rootScope'];
		function validatePan($rootScope){
	        return {
	            restrict: 'A',
	            require: 'ngModel',
	            link: link,
	            scope:true
	        }
	        function link(scope, elem, attr, ctrl) {
	            ctrl.$parsers.unshift(function(value) {

	                value = value.toUpperCase();
	                var regpan = /^([A-Z a-z]){5}([0-9]){4}([A-Z a-z]){1}?$/;
	                if (regpan.test(value) == false) {
	                    ctrl.$setValidity('invalidPan', false);
	                } else {
	                	$rootScope.verify = true;
	                    ctrl.$setValidity('invalidPan', true);
	                }
	                if (value == '') {
	                	$rootScope.verify = undefined;
	                    ctrl.$setValidity('invalidPan', true);
	                }
	                ctrl.$setViewValue(value);
	                ctrl.$render();
	                return value;
	            });

	        }
    	}

    	function bubbleGen(){
    		return {
	            restrict: 'E',
	            link: link,
	            scope:{
	            	length : '=',
	            	goal : '='
	            }
	        }

	        function link(scope, elem, attr, ctrl){
	        	var div = $('<div/>', {
				    class: 'bubble'
				});
	            div.appendTo($('.typeSwiper'));
	            for(var i=0;i<scope.length;i++){
	            	var divDotCover = $('<div/>',{
	            		class : (i == scope.length - 1)?'dot-cover showPseudo':'dot-cover',
	            		'data-content' : (i == scope.length - 1)?scope.goal:''
	            	});
	            	var divDot = $('<div/>',{
	            		class : 'dot active ani'			            		
	            	});
	            	divDot.appendTo(divDotCover)
	            	divDotCover.appendTo(div);
	        	}
    		}
    	}

    	hcChart.$inject = ['$rootScope'];
    	function hcChart($rootScope){
    		return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    items: '=',
                },
                link: function (scope, element) {       	
                    var chart = Highcharts.chart(element[0], {
                    	responsive: {
						  rules: [
							  {
							    condition: {
							      maxWidth: 600
							    },
							    chartOptions: {
							      chart: {
							        width: 500
							      }
							    }
							  }
						  ]
						},
                    	chart: {
			    			backgroundColor : null,
			    			spacingBottom: 10,
					        spacingTop: 20,
					        spacingLeft: 10,
					        spacingRight: 10,
					        height: 300,
					        type: 'line'
						},
						title: {
							text: ''
						},
						yAxis:{
							title:{
								text : ''
							}
						},
						xAxis: {
							categories: [''],
							labels:{enabled: false},
							tickLength: 0
						},
						legend:{
							align:'left'
						},
						tooltip: {
							backgroundColor: '#fdfdfd',
							borderRadius: 10,
							borderWidth: 0,
							formatter: function() {
								scope.calculateAmount(this.y,this.point.date);
								return "<span class='nextline text-center'>"+this.point.date+"</span><br><span class='nextline'>"+this.y+"</span>";
							}
						},
						plotOptions: {
							line: {
								allowPointSelect: true,
								cursor: 'pointer',
								marker: {
								enabled: false
								}
							},
							series: {
								states: {
									hover: {
										enabled: false
									}
								}
							}
						},
						series : scope.items
                    });
                    $('.chart-tabs li').click(function(){
                    	for(var i=0;i<scope.items.length;i++){
                    		chart.series[i].update(scope.items[i]);
                    	} 
                    })
                    scope.calculateAmount = function(nav,date){
                    	$rootScope.nav = {};
                    	$rootScope.nav['amount'] = nav * 100;
                    	$rootScope.nav['date'] = date;
                    	if(!$rootScope.$$phase) $rootScope.$apply();
                    }
                }
            };
    	}

    	function investPieChart(){
    		return{
    			restrict : 'EA',
    			scope:{
    				items : '=',
    				title : '='
    			},
    			link: function (scope, element){
					Highcharts.getOptions().colors = Highcharts.map(['#0580c3', '#0c4f74', '#f26928', '#87350f'], function (color) {
				        return {
				            radialGradient: {
				                cx: 0.6,
				                cy: 0.3,
				                r: 0.7
				            },
				            stops: [
				                [0, color],
				                [1, Highcharts.Color(color).brighten(0.3).get('rgb')]
				            ]
				        };
					});
    				var chart = new Highcharts.Chart(element[0],{
					    chart: {
					        plotBackgroundColor: null,
					        plotBorderWidth: null,
					        plotShadow: false,
					        width: 320,
					        height: 300,
					        spacingLeft: 0,
					    },
					    title: {
					    	useHTML: true,
					        text: scope.title,
					        align: 'center',
					        verticalAlign: 'middle',
					        y: -28,
					        x: -18
					    },
					    tooltip: {
					        formatter: function() {
					            return '<b>'+ this.point.name +'</b>: '+ parseFloat(this.percentage).toFixed(0) +' %';
					        }
					    },
					    plotOptions: {
					        pie: {
					            allowPointSelect: false,
					            cursor: 'pointer',
					            shadow: false,
					            dataLabels: {
					                enabled: false,
					            },
					            borderWidth: 0
					        },
					        series: {
								states: {
									hover: {
										enabled: false
									}
								}
							}
					    },
					    series: [{
					        type: 'pie',
					        name: 'Browser share',
					        innerSize: '50%',
					        data: scope.items
					    }]
					});       
    			}
    		}
    	}

    	schemeChart.$inject = ['$compile']
    	function schemeChart($compile){
    		return{
    			restrict : 'EA',
    			scope:{
    				items : '=',
    				title : '=',
    				colors : '='
    			},
    			link: function (scope, element){
    				var itemLength = scope.items;
					Highcharts.getOptions().colors = Highcharts.map(scope.colors, function (color) {
				        return {
				            radialGradient: {
				                cx: 0.6,
				                cy: 0.3,
				                r: 0.7
				            },
				            stops: [
				                [0, color],
				                [1, Highcharts.Color(color).brighten(0.3).get('rgb')]
				            ]
				        };
					});
    				var chart = new Highcharts.Chart(element[0],{
					    chart: {
					        backgroundColor : null,
					        plotBorderWidth: null,
					        plotShadow: false,
					        width: 250,
					        height: 250,
					        spacingBottom: 0,
					        spacingTop: 0,
					        spacingLeft: -20,
					        spacingRight: 0,
					    },
					    title: {
					    	useHTML: true,
					        text: scope.title,
					        align: 'center',
					        verticalAlign: 'middle',
					        y: -5,
					        x: 0
					    },
					    tooltip: {
					        formatter: function() {
					            return '<b>'+ this.point.name +'</b>: '+ parseFloat(this.percentage).toFixed(0) +' %';
					        }
					    },
					    plotOptions: {
					        pie: {
					            allowPointSelect: false,
					            cursor: 'pointer',
					            shadow: false,
					            dataLabels: {
					                enabled: false,
					            },
					            borderWidth: 0
					        },
					        series: {
								states: {
									hover: {
										enabled: false
									}
								}
							}
					    },
					    series: [{
					        type: 'pie',
					        innerSize: '60%',
					        data: scope.items
					    }]
					});       
    			}
    		}
    	}

    	function customScrollBar(){
    		return {
	            restrict: 'EA',
	            link: function(scope, element){
	            	$(element).mCustomScrollbar({ 
	            		advanced: { 
	            			updateOnContentResize: true, 
	            			updateOnBrowserResize: true 
	            		} 
	            	});
	            	$(window).on('resize',function(){
	            		$(element).mCustomScrollbar("update");
	            	})
	            }
	        }
    	}

    	function accordian() {
	        return {
	            restrict: 'EA',
	            link: link
	        }
	        function link(scope, elem, attr) {
	            elem.on('shown.bs.collapse', function(e) {
	                elem.parent().find(".panel-title a").addClass("rotate");
	                elem.parent().find(".panel-title a").text('COLLAPSE');
	            });
	            elem.on('hidden.bs.collapse', function(e) {
	            	elem.parent().find(".panel-title a").removeClass("rotate");
	            	elem.parent().find(".panel-title a").text('EXPAND');
	            });
	        }
	    }
})();