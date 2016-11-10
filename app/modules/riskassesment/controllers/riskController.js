(function(){
	'use strict';
	angular
		.module('finApp.riskAssesment')
		.controller('riskController',riskController);

		riskController.$inject = ['$scope','riskService'];
		function riskController($scope,riskService){
			$scope.resultObject = '0';
			$scope.appendFormValues = function(data){
				riskService.setAssesmentObject(JSON.parse(data));
				var assesValues = riskService.getAssesmentObject();
				riskService.getAssesmentResult(assesValues).then(function(data){
					if('success' in data){
						$scope.resultObject = Number(data.success['risk_score']);
						localStorage.setItem('riskData', JSON.stringify(assesValues));
						if(!$scope.$$phase)	$scope.$apply(); 
					}
				});
				if(!$scope.$$phase)	$scope.$apply(); 
			}
		}
})();