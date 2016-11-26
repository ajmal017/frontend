(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('automobileController',automobileController);

		automobileController.$inject = ['$scope','$rootScope','$location','retirementGoalsService']
		function automobileController($scope,$rootScope,$location,retirementGoalsService){
		}
})();