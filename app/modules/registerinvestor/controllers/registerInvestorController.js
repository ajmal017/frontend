(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerInvestorController',registerInvestorController);

		registerInvestorController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function registerInvestorController($rootScope,$scope,$http,registerInvestorService){
		}
})();