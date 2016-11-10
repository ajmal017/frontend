(function(){
	'use strict';
	angular
		.module('finApp.registration')
		.controller('registerController',registerController);

		registerController.$inject = ['$scope','$location','registerService']
		function registerController($scope,$location,registerService){
			$scope.register = function(user){
				
			}
		}
})();