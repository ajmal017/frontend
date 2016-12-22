(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSignatureController',registerSignatureController);

		registerSignatureController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function registerSignatureController($rootScope,$scope,$http,registerInvestorService){
			$scope.showSigniture = function(){
				$('#signitureModal').modal('show');
			}
			$scope.done = function (){
				var signature = $scope.accept();
				$('#signitureModal').modal('hide');
			}
		}
})();