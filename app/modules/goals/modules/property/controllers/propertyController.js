(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('propertyController',propertyController);

		propertyController.$inject = ['$scope','$rootScope','$location','retirementGoalsService']
		function propertyController($scope,$rootScope,$location,retirementGoalsService){
		}
})();