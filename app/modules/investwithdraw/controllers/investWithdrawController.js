(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw')
		.controller('investWithdrawController',investWithdrawController);

		investWithdrawController.$inject = ['$scope','$rootScope','$location','investWithdrawService']
		function investWithdrawController($scope,$rootScope,$location,investWithdrawService){
			$scope.resultPercentage = [
				['Equity',   30],
				['Debt',     20],
				['ELSS',     25],
				['LIQUID',     25]
			];
			$scope.legends = [];
			var colors = ['#0580c3', '#0c4f74', '#f26928', '#87350f'];
			var price = ['524920030', '1020320030', '1020320030', '1020320030'];
			for(var i=0;i<$scope.resultPercentage.length;i++){
				var legendObject = {};
				legendObject['name'] = $scope.resultPercentage[i][0];
				legendObject['value'] = $scope.resultPercentage[i][1];
				legendObject['price'] = price.splice(0,1).toString();
				legendObject['color'] = colors.splice(0,1).toString();
				legendObject['borderColor'] = '10px solid '+legendObject['color'];
				$scope.legends.push(legendObject);
			}
			$scope.pieTitle = "<span class='currency'>&#8377;</span><span class='content'><span>12.2</span><span class='nextline'>lakh</span></span>";
		}
})();