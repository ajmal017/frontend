(function(){
	'use strict';
	angular
		.module('finApp.directives',[])
		.directive('clickRedirect',clickRedirect)
		.directive('finHeader',finHeader)
		.directive('finDrawer',finDrawer)
		.directive('finLoader',finLoader)
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
		.directive('validateIfsc',validateIfsc)
		.directive('validatePincode',validatePincode)
		.directive('bubbleGen',bubbleGen)
		.directive('hcChart',hcChart)
		.directive('goalChart',goalChart)
		.directive('investPieChart',investPieChart)
		.directive('schemeChart',schemeChart)
		.directive('customScrollBar',customScrollBar)
		.directive('accordian',accordian)
		.directive('goalLoading',goalLoading)
		.directive('uploadFile',uploadFile)
		.directive('getFileUploaded',getFileUploaded)
		.directive('captureVideo',captureVideo)
		.directive('riskImage',riskImage)
		.directive('riskType',riskType)
		.directive('showFactsheet',showFactsheet)
		.directive('disableTab',disableTab);

		clickRedirect.$inject = ['$location','$rootScope'];
	    function clickRedirect($location,$rootScope) {
	        var directive = {
	            link: link,
	            restrict: 'EA'
	        };
	        return directive;

	        function link($scope, $element, $attrs) {
	            $element.on('click', function() {
	            	if ($attrs.clickRedirect) {
		                $location.path($attrs.clickRedirect);
		                $scope.$apply();
	            	}
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
				    console.log('$rootScope.title',$rootScope.title);
				}
			};
		}

		var drawerAnimate = function(){
	        $('.drawer').toggleClass('open');
	        $('.drawer-overlay').toggleClass('open');
	        $('.page-wrapper').toggleClass('open');
	        $('.bar1,.bar2').toggleClass('open');
	    };

	    function finLoader(){
	    	return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/partials/loader.html'
			};
	    }

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
							if(ngModel.$viewValue == '' || ngModel.$viewValue == undefined){
								var currentDate = new Date();
								var currentYear = currentDate.getFullYear();
								$scope.max = currentYear + parseInt($scope.yearMax);
								$scope.min = currentYear + 1;
								model = $scope.min;
								$scope.model = $scope.min;
								ngModel.$setViewValue($scope.model);
							} else {
								$scope.model = ngModel.$viewValue;
								model = ngModel.$viewValue;
								ngModel.$setViewValue($scope.model);
							}
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
							$scope.model = model;
							ngModel.$setViewValue($scope.model);
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
	    		scope:{
	    			disabled : '=dropdownDisable'
	    		},	
	    		link : function($scope,$element,$attr,ngModel){
	    			console.log('disabled',$scope.disabled);
	    			console.log("in link: " + $element.id);
	    			setTimeout(function(){
	    				var $this = $element,
        			numberOfOptions = $this.children('option').length;
		    			console.log("in link timeout: " + $element.id);
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
				        if($this.children('option').eq(i).val() ==  ngModel.$viewValue){
				        	$this.children('option').eq(i).attr('selected', true);	
				        }else if($scope.disabled != undefined){
				        	$this.children('option').eq(1).attr('selected', true);
				        }
				        $styledSelect.text($this.children('option[selected]').text());
				        ngModel.$setViewValue($this.children('option[selected]').val());
				    }
				    var $listItems = $list.children('li');
				    $listItems.eq(0).remove();			    
				    $styledSelect.click(function (e) {
				        e.stopPropagation();
				        if($scope.disabled != undefined && $scope.disabled =='locked'){
				        	e.stopPropagation();
				        	e.preventDefault();
				        }else{
				        	$('.customSwiper .fin-btn-group').css('z-index',0);
				        	$('div.styledSelect.active').each(function () {
				            	$(this).removeClass('active').next('ul.options').hide();
				        	});
				        	$(this).toggleClass('active').next('ul.options').toggle();
				        }			        
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
				    if(parseInt($list.outerHeight()) > 400 && $attr['scrollHeight'] == undefined){
				    	$this.parent().find('.options').mCustomScrollbar({setHeight:300,axis:"y"});
				    }
				    
				    if($attr['scrollHeight'] != undefined){
				    	$this.parent().find('.options').mCustomScrollbar({setHeight:parseInt($attr['scrollHeight']),axis:"y"})
				    }
				    
	                ngModel.$render = function() {
	                	if (!$this.children('option[selected]') || $this.children('option[selected]').val() !=  ngModel.$viewValue ) {
						    for (var i = 0; i < numberOfOptions; i++) {
						        if($this.children('option').eq(i).val() ==  ngModel.$viewValue){
						        	console.log("Setting option == val: " + ngModel.$viewValue);
						        	$this.children('option').eq(i).attr('ng-selected', true);
							        $styledSelect.text($this.children('option').eq(i).text());

						        }
						    }
	                		
	                	}
	                };

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
					// ngModel.$setValidity('oneUpper',false);
					ngModel.$setValidity('oneSmall',false);
					ngModel.$setValidity('minlength',false);
					scope.reset = true;
					function validate(value){
						if(value){
							scope.reset = false;
							var atleastOneNumber = /^(?=.*\d)/.test(value);
							ngModel.$setValidity('oneNumber',atleastOneNumber);
							// var atleastOneUpper = /^(?=.*[A-Z])/.test(value);
							// ngModel.$setValidity('oneUpper',atleastOneUpper);
							var atleastOneSmall = /^(?=.*[a-z])/.test(value);
							ngModel.$setValidity('oneSmall',atleastOneSmall);
							var minlength = /^[0-9a-zA-Z]{8,}/.test(value);
							ngModel.$setValidity('minlength',minlength);
							return value;
						}else{
							scope.reset = true;
							ngModel.$setValidity('oneNumber',false);
							// ngModel.$setValidity('oneUpper',false);
							ngModel.$setValidity('oneSmall',false);
							ngModel.$setValidity('minlength',false);
						}					
						// console.log("Number--"+atleastOneNumber+"One Upper"+atleastOneUpper+"One Small"+atleastOneSmall+""+minlength);
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
		            ctrl.$formatters.unshift(function (a) {
		                return $filter(attrs.format)(ctrl.$modelValue)
		            });

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
					attrs.$observe('oneTimeEquity', function () {
						var equityValue = attrs['oneTimeEquity'];
						var arcPercentage = (180/100)*equityValue;
						var arcPos = arcPercentage - 45;
						element.find('.orbit').css('transform','rotate('+arcPos+'deg)');
						var textTop = element.find('.indicator').position().top;
						var textLeft = element.find('.indicator').position().left;
						element.find('h4').css({
							'top' : textTop + 35,
							'left': textLeft + 70
						});
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

		validateIfsc.$inject=['$rootScope'];
		function validateIfsc($rootScope){
	        return {
	            restrict: 'A',
	            require: 'ngModel',
	            link: link,
	            scope:true
	        }
	        function link(scope, elem, attr, ctrl) {
	            ctrl.$parsers.unshift(function(value) {

	                value = value.toUpperCase();
	                var regifsc = /^([A-Z a-z]){4}([0-9]){7}?$/;
	                if (regifsc.test(value) == false) {
	                    ctrl.$setValidity('invalidIFSC', false);
	                } else {
	                    ctrl.$setValidity('invalidIFSC', true);
	                }
	                if (value == '') {
	                    ctrl.$setValidity('invalidIFSC', true);
	                }
	                ctrl.$setViewValue(value);
	                ctrl.$render();
	                return value;
	            });

	        }
    	}

		validatePincode.$inject=['$rootScope'];
		function validatePincode($rootScope){
	        return {
	            restrict: 'A',
	            require: 'ngModel',
	            link: link,
	            scope:true
	        }
	        function link(scope, elem, attr, ctrl) {
	            ctrl.$parsers.unshift(function(value) {

	                value = value.toUpperCase();
	                var regPincode = /^([0-9]){6}?$/;
	                if (regPincode.test(value) == false) {
	                    ctrl.$setValidity('invalidPincode', false);
	                } else {
	                    ctrl.$setValidity('invalidPincode', true);
	                }
	                if (value == '') {
	                    ctrl.$setValidity('invalidPincode', true);
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
    		var chart = null;
    		return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    items: '=',
                },
                link: function (scope, element) {       	
                    chart = Highcharts.chart(element[0], {
                    	
                    	chart: {
			    			backgroundColor : null,
			    			spacingBottom: 10,
					        spacingTop: 20,
					        spacingLeft: 10,
					        spacingRight: 10,
					        type: 'line',
					        events:{
				            	load:function(){
				            		var outerWidth = parseInt($('.chart-cover').outerWidth());
	                				var applyWidth = outerWidth - 100;
	                				setTimeout(function(){
	                					chart.setSize(applyWidth,300);
	                				},0);			            		
				            	}
			            	}
						},
						title: {
							text: ''
						},
						yAxis:{
							title:{
								text : ''
							},
							lineWidth: 1
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
								},
								turboThreshold: 0,
							},
						},
						series : scope.items
                    });
                    $('.chart-tabs li').click(function(){
                    	for(var i=0;i<scope.items.length;i++){
                    		chart.series[i].update(scope.items[i]);
                    	} 
                    })
                    $(window).on('resize',function(){
                    	var outerWidth = parseInt($(element).parent().outerWidth());
                		var applyWidth = outerWidth - 100;
                		
                		setTimeout(function(){
                			chart.setSize(applyWidth, 300);
                			setTimeout(function(){
                				chart.setSize(applyWidth, 300);
                			},100);
                		},0);
                    		             	
	            	});
                    scope.calculateAmount = function(nav,date){
                    	$rootScope.nav = {};
                    	$rootScope.nav['amount'] = nav * 100;
                    	$rootScope.nav['date'] = date;
                    	if(!$rootScope.$$phase) $rootScope.$apply();
                    }
                }
            };
    	}

    	goalChart.$inject = ['$filter'];
    	function goalChart($filter){
    		var chart = null;
    		return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                	chartoptions:'='
                },
                link: function (scope, element) {  
                	chart = Highcharts.chart(element[0], {
			        chart: {
			        	backgroundColor : null,
			            type: 'spline',
			            events:{
			            	load:function(){
			            		var outerWidth = parseInt($(element).parent().outerWidth());
                				var applyWidth = outerWidth - 50;
                				setTimeout(function(){
                					chart.setSize(applyWidth,300);
                				},100);			            		
			            	}
			            }
			        },
			        colors:['#4ea1d2','#aedba0'],
			        legend:false,
			        credits:{
			        	enabled : false
			        },
			        title: {
			            text: ''
			        },
			        xAxis: {
			        		categories: scope.chartoptions.category,
			            labels: {
			                align: 'left'
			            },
			            tickLength: 0,
			            tickInterval:scope.chartoptions.interval
			        },
			        yAxis: [{
			        		opposite:true,
							title:{
								text : ''
							},
			            labels: {
			                enabled: true,
			                formatter: function () {
			                	var value = $filter('amountSeffix')(this.value);
			                	return value;
			                }
			            },
			            gridLineWidth: 1,
			            gridLineDashStyle: 'dash',
			            lineWidth: 1
			        }],
			        tooltip: {
			           useHTML: true,
			            borderWidth: 0,
			            borderRadius: 10,
			            followTouchMove:true,
			            shadow: false,
             			backgroundColor: "rgba(245,245,245,1)",
			            style: {
			                padding: 40,
			            },
			            formatter: function() {
			                 return '<span class="chartTooltip">'
			                 +'<span class="chartYear">'+this.x+'</span>'
				 				+'<span class="nextline content-first">'
					 				+'<span class="content">Invested</span>'
					 				+'<span class="currency">&#8377;</span>'
					 				+'<span class="amount">'+this.point.invested+'</span>'
				 				+'</span>'
								+'<span class="nextline content-secound">'
				 				+'<span class="content">Projected</span>'
				 				+'<span class="currency">&#8377;</span>'
				 				+'<span class="amount">'+this.point.projected+'</span>'
				 				+'</span></span>';
						}
			        },
			        plotOptions: {
			            spline: {
			                lineWidth: 4,
			                states: {
			                    hover: {
			                        lineWidth: 2,
			                        enabled: true,		                        
			                    }
			                },
			                allowPointSelect: true,
							cursor: 'pointer',
							marker: {
								enabled: false
							}
			            },
			            series:{
			            	lineWidth:2,
			            	marker: {
			             		 states: {
			                 	hover: {
			                      enabled: true,
			                      radiusPlus: 10,
			                      fillColor: '#f9f9f9',
			                  }
			                 },
			                 symbol:'circle'
			              }
			            }
			        },
			        series: scope.chartoptions.series
			    	});
					$(window).on('resize',function(){
                    	var outerWidth = parseInt($(element).parent().outerWidth());
                		var applyWidth = outerWidth - 50;
                		setTimeout(function(){
                			chart.setSize(applyWidth, 300);
                			setTimeout(function(){
                				chart.setSize(applyWidth, 300);
                			},100);
                		},0);
	            	});
					var chartoptions = scope.chartoptions || {};
					scope.$watch('chartoptions.title', function(newTitle, oldTitle) {
						if (newTitle) {
						chart.yAxis[0].setTitle({'text':newTitle}, true);
						chart.redraw();
            			setTimeout(function(){
    						chart.yAxis[0].setTitle({'text':newTitle}, true);
            				chart.redraw();
            			},100);

						}
					}, true);
					
					scope.$watch('chartoptions.series', function(newSeries, oldSeries) {
						if (newSeries && newSeries.length == chart.series.length) {
							for (var i=0; i<chart.series.length; i++) {
								chart.series[i].setData(newSeries[i].data);
							}
							chart.redraw();
						}
					}, true);

					scope.$watch('chartoptions.category', function(newCategory, oldCategory) {
							chart.xAxis[0].setCategories(newCategory);
							chart.redraw();
					}, true);
					scope.$watch('chartoptions.interval', function(newInterval, oldInterval) {
						chart.xAxis[0].update({tickInterval:newInterval});
						chart.redraw();
				}, true);

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
    			link: function (scope, element, attrs){


    				scope.$watch('colors', function() {
	    				
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
					}, true);

    				scope.$watch('items', function() {
    					var itemLength = scope.items;
    					console.log('items',itemLength);
    				
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
					        data: itemLength
					    }]
					});    
					},true);   
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

	    goalLoading.$inject = [];
		function goalLoading(){
			return{
				restrict : 'EA',
			 	templateUrl:'modules/common/views/partials/goalloading.html',
			 	scope : {
			 		
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

		function uploadFile(){
            return {
              restrict: 'A',
              link: function(scope, element,attrs) {
                element.bind('click', function() {
                    angular.element('#'+attrs.uploadFile).trigger('click');
                });
              }
            };
        }

		getFileUploaded.$inject = ['$rootScope'];
        function getFileUploaded($rootScope){
        	return {
              restrict: 'A',

              link: function(scope, element,attrs) {
                element.on('change', function() {
                	var file = element[0].files[0];
                	var outVideo = document.getElementById('outputVideo');
                	var thumbnail = document.getElementById('outputImage');
                	var videoSrc = URL.createObjectURL(file);
                	outVideo.src = videoSrc;
                	var canvas = document.createElement("canvas");
                	canvas.width = 100;
                	canvas.height = 100;
                	outVideo.currentTime = 10;
                	setTimeout(function(){
                		canvas.getContext('2d').drawImage(outVideo, 0, 0, canvas.width, canvas.height);
	                	var img = document.createElement("img");
	        			img.src = canvas.toDataURL();
	        			console.log(img.src);
	        			thumbnail.prepend(img);
	        			$rootScope.capturedFile = {
			        		'blob' : file,
			        		'thumbnail' : img.src
			        	};
                	},1000);                	
                });
              }
            };
        }

        captureVideo.$inject = ['$rootScope'];
        function captureVideo($rootScope){
        	return {
              restrict: 'A',
              link: function(scope, element,attrs) {
                var player = videojs(element[0], {
				    controls: true,
				    width: 320,
				    height: 240,
				    plugins: {
				        record: {
				            audio: true,
				            video: true,
				            maxLength: 10,
				            debug: true,
				            videoMimeType:'video/mp4',
				            maxLength: 60,
				        }
				    }
				});
				player.on('deviceError', function(){
				    console.log('device error:', player.deviceErrorCode);
				});

				player.on('startRecord', function(){
				    console.log('started recording!');
				});
				player.on('finishRecord', function(){
					$rootScope.$apply(function () {
			        	var outVideo = document.getElementById('outputVideo');
	                	var thumbnail = document.getElementById('outputImage');
	                	outVideo.src = $('.vjs-tech').attr('src');
	                	var canvas = document.createElement("canvas");
	                	canvas.width = 100;
	                	canvas.height = 100;
	                	outVideo.currentTime = 2;
	                	setTimeout(function(){
	                		canvas.getContext('2d').drawImage(outVideo, 0, 0, canvas.width, canvas.height);
		                	var img = document.createElement("img");
		        			img.src = canvas.toDataURL();
		        			console.log(img.src);
		        			thumbnail.prepend(img);
		        			$rootScope.capturedFile = {
				        		'blob' : player.recordedData,
				        		'thumbnail' : img.src
				        	};
	                	},1000); 

			        });					
				});
              }
            };
        }

        riskImage.$inject=['$rootScope'];
		function riskImage($rootScope){
			console.log('risky');
    		return {
	            restrict: 'EA',
	            link: link,
	            
	        }

	        function link(scope, elem, attr, ctrl){
	        	var $this = elem;
	            var risk = $rootScope.userRiskFactor;
	            var riskImage = '';
	            
	            if(risk > 0 && risk < 4) {
	            	riskImage = '<img src= "assets/images/categoryImage1.png" class="img img-responsive" />';
	            	riskType = '<span class="text-center">Low Risk</span>';
	            } else if(risk >= 4.1 && risk <= 6.0) {
	            	riskImage = '<img src= "assets/images/categoryImage3.png" class="img img-responsive" />';
	            	riskType = '<span class="text-center">Below Average Risk</span>';      	
	            } else if(risk >= 6.1 && risk <= 7.5) {
	            	riskImage = '<img src= "assets/images/assesmentCar.png" class="img img-responsive" />';
	            	riskType = '<span class="text-center">Average Risk</span>';      	
	            	
	            } else if(risk >= 7.6 && risk <= 9.0) {
	            	riskImage = '<img src= "assets/images/categoryImage2.png" class="img img-responsive" />';
	            	riskType = '<span class="text-center">Above Average Risk</span>';      	
	            	
	            } else if(risk >= 9.1 && risk <= 10.0) {
	            	riskImage = '<img src= "assets/images/categoryImage4.png" class="img img-responsive" />';
	            	riskType = '<span class="text-center">High Risk</span>';
	            }

	            $this.wrap(riskImage);
	            
	            
    		}
    	}

        riskType.$inject=['$rootScope'];
		function riskType($rootScope){
			console.log('risky');
    		return {
	            restrict: 'EA',
	            link: link,
	            
	        }

	        function link(scope, elem, attr, ctrl){
	        	var $this = elem;
	            var risk = $rootScope.userRiskFactor;
	           
	            var riskType = '';
	            if(risk > 0 && risk < 4) {
	            	
	            	riskType = '<p class="text-center">Low Risk</p>';
	            } else if(risk >= 4.1 && risk <= 6.0) {
	            	
	            	riskType = '<p class="text-center">Below Average Risk</p>';      	
	            } else if(risk >= 6.1 && risk <= 7.5) {
	            	
	            	riskType = '<p class="text-center">Average Risk</p>';      	
	            	
	            } else if(risk >= 7.6 && risk <= 9.0) {
	            	
	            	riskType = '<p class="text-center">Above Average Risk</p>';      	
	            	
	            } else if(risk >= 9.1 && risk <= 10.0) {
	            	
	            	riskType = '<p class="text-center">High Risk</p>';
	            }

	            $this.wrap(riskType);
	            
	            
    		}
    	}

		showFactsheet.$inject = ['$location','$rootScope','recommendedService','busyIndicator'];
	    function showFactsheet($location,$rootScope,recommendedService,busyIndicator) {
	        var directive = {
	            link: link,
	            restrict: 'EA'
	        };
	        return directive;

	        function link($scope, $element, $attrs) {
	            $element.on('click', function() {
	            	busyIndicator.show();
	            	recommendedService.getFactsheetData($attrs.showFactsheet).then(function(data){
	            		busyIndicator.hide();
			    		if('success' in data){
			    			$rootScope.factsheetData = data.success;
					    	recommendedService.getHistoricPerformance($attrs.showFactsheet).then(function(dataPerformance){
					    		if('success' in data){
					    			$rootScope.histPerformanceData = dataPerformance.success;
					    			$location.path('/schemeFactsheet');
					    		}
					    		else {

					    		}
					    	});
	    			
			    		}	
			    		else {

			    		}
			    	});


	                
	                
	            });
	        }
	    }

	    disableTab.$inject = ['$rootScope'];
		function disableTab($rootScope){
			return{
				restrict : 'EA',				
				link: function($scope,$element,$attr){
					 $element.bind('keydown keypress', function(event){
					 	if(event.which === 9){
					 		event.preventDefault();
					 	}
					 });
				}
			};			
		}
})();