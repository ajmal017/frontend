(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw')
		.controller('investWithdrawController',investWithdrawController);

		investWithdrawController.$inject = ['$scope','$rootScope','$location','investWithdrawService']
		function investWithdrawController($scope,$rootScope,$location,investWithdrawService){
			$scope.resultPercentage = [
				['Equity',   45.0],
				['Debt',     26.8],
			];
			$scope.pieTitle = "<span class='currency'>&#8377;</span><span class='content'>12.2</span><span class='nextline'>lakh</span>";
		}
})();