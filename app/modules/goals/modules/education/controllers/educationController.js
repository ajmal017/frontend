(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('educationController',educationController);

		educationController.$inject = ['$scope','$rootScope','$location','retirementGoalsService']
		function educationController($scope,$rootScope,$location,retirementGoalsService){
		}
})();