(function(){
	'use strict';
	angular
		.module('finApp.directives',[])
		.directive('finHeader',finHeader)
		.directive('finDrawer',finDrawer);

		function finHeader(){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/header.html',
				link: function($scope,$element,$attr){
					 $('.menu,.drawer-overlay,.close-value').on('click',function(){
				        drawerAnimate();
				    });
				    var drawerAnimate = function(){
				        $('.drawer').toggleClass('open');
				        $('.drawer-overlay').toggleClass('open');
				        $('.page-wrapper').toggleClass('open');
				         $('.bar1,.bar2').toggleClass('open');
				    };
				}
			};			
		}

		function finDrawer(){
			return{
				restrict : 'E',
				replace:true,
				templateUrl:'modules/common/views/drawer.html'
			};
		}
})();