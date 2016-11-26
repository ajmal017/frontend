(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('vacationController',vacationController);

		vacationController.$inject = ['$scope','$rootScope','$location','vacationService']
		function vacationController($scope,$rootScope,$location,vacationService){
		}
})();