(function(){
	'use strict';
	angular
		.module('finApp.riskAssesment')
		.controller('riskController',riskController);

		riskController.$inject = ['$rootScope','$scope','riskService','$location'];
		function riskController($rootScope,$scope,riskService, $location){
			$scope.resultObject = '0';
			$scope.modelVal = {};
			$scope.modelVal = riskService.getAssesmentObject();
			$scope.disableAppend = true;
			if($scope.modelVal.A8)
			{
				$scope.modelVal.noneInvestments = $scope.modelVal.A8;
				$scope.disableAppend = false;
			}

			$scope.appendFormValues = function(data){
				if (typeof(data) !== "undefined" && data != undefined) {
				var deleteObj = JSON.parse(data);
				delete deleteObj.noneInvestments;
				console.log('data',deleteObj);
				riskService.setAssesmentObject(deleteObj);
				}
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
				{name : 'Fixed Deposits', value : 'op1', selected : false},
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

		  	$scope.changeInvestments = function() {
		  	// watch investments for changes
		  	$scope.modelVal.noneInvestments = false;
			  $scope.$watch('past_investments|filter:{selected:true}', function (nv) {
			    $scope.selection = nv.map(function (data) {
			      	return data.value;
			    
			    });
			  $scope.modelVal.A8 = $scope.selection.join();
			  if($scope.selection.length < 1 && $scope.modelVal.noneInvestments != 'op5'){
			  	
			  	$scope.disableAppend = true;
			  } else {
			  	$scope.disableAppend = false;
			  }
			  }, true);
			}

			  $scope.resetInvestments = function() {
			  	$scope.past_investments = [
					{name : 'Fixed Deposits', value : 'op1', selected : false},
					{name : 'Other Fixed Income Products (PPF, Debt Mutual Funds, etc.)', value: 'op2', selected:false},
					{name : 'Equity Mutual Funds', value : 'op3', selected:false},
					{name : 'Direct Stocks', value : 'op4', selected:false}
				];
				$scope.modelVal.A8 = 'op5';
				$scope.modelVal.noneInvestments = 'op5';
				$scope.disableAppend = false;
			  }
			  $scope.uncheck = function() {
			  	console.log('noneInvestments',$scope.modelVal.A8);
			  	if($scope.modelVal.noneInvestments == 'op5'){
			  		
			  		$scope.resetInvestments();
			  		$scope.disableAppend = false;
			  	} else {
			  		$scope.disableAppend = true;
			  	}
			  }

/*				if(!jQuery.isEmptyObject($scope.modelVal) && $location.$$path == '/riskAssesment') {
					if (!$rootScope.gotoFirstRiskAssessment) {
						if ($scope.modelVal.A1 && $scope.modelVal.A4 && $scope.modelVal.A7 && $scope.modelVal.A8 && $scope.modelVal.A9 && 
							$scope.modelVal.A15 && $scope.modelVal.A16 && $scope.modelVal.A17 && $scope.modelVal.A18 && $scope.modelVal.A19) {
							$rootScope.slideTobeChanged = 6;
						}
							
					}
				}
*/
			  // console.log('investments selected', $scope.selection);
		}
})();