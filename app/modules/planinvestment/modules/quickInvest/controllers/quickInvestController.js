(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('quickInvestController',quickInvestController);

		quickInvestController.$inject = ['$scope','$rootScope','$location','planInvestService']
		function quickInvestController($scope,$rootScope,$location,planInvestService){
			$scope.appendFormValues = function(data){
				alert(JSON.stringify(data));
			}
		}
})();