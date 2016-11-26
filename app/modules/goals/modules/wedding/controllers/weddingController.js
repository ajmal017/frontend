(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('weddingController',weddingController);

		weddingController.$inject = ['$scope','$rootScope','$location','weddingService']
		function weddingController($scope,$rootScope,$location,weddingService){
		}
})();