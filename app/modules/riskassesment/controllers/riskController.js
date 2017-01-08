(function(){
	'use strict';
	angular
		.module('finApp.riskAssesment')
		.controller('riskController',riskController);

		riskController.$inject = ['$rootScope','$scope','riskService'];
		function riskController($rootScope,$scope,riskService){
			$scope.resultObject = '0';
			$scope.modelVal = {};

			$scope.modelVal = riskService.getAssesmentObject();
			

			$scope.appendFormValues = function(data){
				riskService.setAssesmentObject(JSON.parse(data));
				var assesValues = riskService.getAssesmentObject();
				riskService.getAssesmentResult(assesValues).then(function(data){
					if('success' in data){
						$scope.resultObject = Number(data.success['risk_score']);
						if(!$rootScope.loggedIn){
							localStorage.setItem('riskData', JSON.stringify(assesValues));
						}					
						if(!$scope.$$phase)	$scope.$apply(); 
					}
				});
				if(!$scope.$$phase)	$scope.$apply(); 
			}

			$scope.past_investments = [
				{name : 'Fixed Deposits', value : 'op1', selected : true},
				{name : 'Other Fixed Income Products (PPF, Debt Mutual Funds, etc.)', value: 'op2', selected:false},
				{name : 'Equity Mutual Funds', value : 'op3', selected:false},
				{name : 'Direct Stocks', value : 'op4', selected:false}
			];

			if(!jQuery.isEmptyObject($scope.modelVal)){
				var array = new Array();
				$scope.selectedValues = new Array();
				array = $scope.modelVal.A8.split(",");
				$scope.selectedValues = array;
				if($scope.selectedValues.length){
					$scope.selectedValues.forEach(function(selectedData, index){
						$scope.past_investments.forEach(function(data, index){
							if(data['value'] == selectedData){
								data['selected'] = true;
							}
						});
					});
				}
			}
			
			$scope.selection = [];
			 // helper method to get selected investments
		  	$scope.selectedInvestments = function selectedInvestments() {
		    	return filterFilter($scope.past_investments, { selected: true });
		  	};

		  	// watch investments for changes
			  $scope.$watch('past_investments|filter:{selected:true}', function (nv) {
			    $scope.selection = nv.map(function (data) {
			      return data.value;
			    });
			    $scope.modelVal.A8 = $scope.selection.join();
			  console.log('investments selected', $scope.selection);
			  if($scope.selection.length < 1){
			  	$scope.disableAppend = true;
			  } else {
			  	$scope.disableAppend = false;
			  }
			  }, true);


			  // console.log('investments selected', $scope.selection);
		}
})();