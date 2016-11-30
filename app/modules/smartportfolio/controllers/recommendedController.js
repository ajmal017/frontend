(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio')
		.controller('recommendedController',recommendedController);

		recommendedController.$inject = ['$rootScope','$scope','$http','recommendedService'];
		function recommendedController($rootScope,$scope,$http,recommendedService){
			$('.seperate-cover').mCustomScrollbar();
			setTimeout(function(){
				$('.schemes-cover').mCustomScrollbar();
			},10);

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