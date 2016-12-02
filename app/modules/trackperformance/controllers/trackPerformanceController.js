(function(){
	'use strict';
	angular
		.module('finApp.trackPerformance')
		.controller('trackPerformanceController',trackPerformanceController);

		trackPerformanceController.$inject = ['$scope','$rootScope','$http','$location','trackPerformanceService','recommendedService']
		function trackPerformanceController($scope,$rootScope,$http,$location,trackPerformanceService,recommendedService){
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
		}
})();