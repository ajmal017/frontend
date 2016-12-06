(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('earnInterestController',earnInterestController);

		earnInterestController.$inject = ['$scope','$rootScope','$location','planInvestService']
		function earnInterestController($scope,$rootScope,$location,planInvestService){

		}
})();