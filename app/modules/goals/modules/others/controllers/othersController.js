(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('othersController',othersController);

		othersController.$inject = ['$scope','$rootScope','$location','othersService']
		function othersController($scope,$rootScope,$location,othersService){
		}
})();