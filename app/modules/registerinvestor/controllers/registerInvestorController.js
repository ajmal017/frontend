(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerInvestorController',registerInvestorController);

		registerInvestorController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function registerInvestorController($rootScope,$scope,$http,registerInvestorService){
			$http.get('modules/common/config/contry.json').success(function(response) {
		        $scope.countryList = response;
		    });
		    $scope.test = function(){
		    	alert('dfdfdf');
		    }
		}
})();