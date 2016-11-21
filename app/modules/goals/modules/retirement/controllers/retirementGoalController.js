(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('retirementGoalsController',retirementGoalsController);

		retirementGoalsController.$inject = ['$scope','$rootScope','$location','retirementGoalsService']
		function retirementGoalsController($scope,$rootScope,$location,retirementGoalsService){
		}
})();