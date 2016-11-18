(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('goalsController',goalsController);

		goalsController.$inject = ['$scope','$rootScope','$location','goalsService']
		function goalsController($scope,$rootScope,$location,goalsService){

		}
})();