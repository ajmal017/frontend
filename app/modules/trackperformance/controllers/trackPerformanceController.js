(function(){
	'use strict';
	angular
		.module('finApp.trackPerformance')
		.controller('trackPerformanceController',trackPerformanceController);

		trackPerformanceController.$inject = ['$scope','$rootScope','$http','$location','$filter','trackPerformanceService','recommendedService']
		function trackPerformanceController($scope,$rootScope,$http,$location,$filter,trackPerformanceService,recommendedService){
			$http.get('modules/common/config/test.json').success(function(response) {
				$scope.response = response;
				var defaultYear = 'three_year';
		        $scope.populateGraph(defaultYear);
		    });
		    $scope.populateGraph = function(year){
		    	recommendedService.getGraphResultSet($scope.response,year).then(function(data){
		    		$scope.resultSet = data;
		    		if(!$scope.$$phase) $scope.$apply();
		    	})
		    }
		    $scope.resultPercentage = [
				['Equity',   30],
				['Debt',     20],
				['ELSS',     25],
				['LIQUID',     25]
			];
			$scope.colors = [];
			var init = 0.2;
			for(var i=0;i<$scope.resultPercentage.length;i++){
				init = init - 0.1 ;
				var color = trackPerformanceService.getHexcolors('#047ac1',init);
				$scope.colors.push(color);
			}
			var pieCurrency =  $filter('amountSeffix')(1200000);
			$scope.pieTitle = "<p><span class='currency'>&#8377;</span><span class='content'>"+pieCurrency+"</span><span class='nextline'>Returns 0%</span></p>";
			
		}
})();