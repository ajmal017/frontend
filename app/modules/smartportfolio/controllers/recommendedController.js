(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio')
		.controller('recommendedController',recommendedController);

		recommendedController.$inject = ['$rootScope','$scope','$http','$timeout','recommendedService', 'busyIndicator', '$location', 'goalsService'];
		function recommendedController($rootScope,$scope,$http,$timeout,recommendedService, busyIndicator, $location, goalsService){
			
			$scope.recommendedSchemesObject = {}; 
			$scope.schemeList = {};
			// $('.seperate-cover').mCustomScrollbar();
			setTimeout(function(){
				$('.seperate-cover').mCustomScrollbar();
			},10);

			$rootScope.subHeader = 'GO BACK TO '+ $rootScope.currentGoal.toUpperCase() +' GOAL';
			$rootScope.redirectURL = '/'+ $rootScope.currentGoal +'Started'
			// $('.scheme-compare-other').mCustomScrollbar();
			// $http.get('modules/common/config/test.json').success(function(response) {
			// 	$scope.response = response;
			// 	var defaultYear = 'three_year';
		 //        $scope.populateGraph(defaultYear);
		 //    });
		 //    $scope.populateGraph = function(year){
		 //    	recommendedService.getGraphResultSet($scope.response,year).then(function(data){
		 //    		$scope.resultSet = data;
		 //    		if(!$scope.$$phase) $scope.$apply();
		 //    	})
		 //    }

		    $scope.compareAndModify = function(currentSchemeType) {
		    	$rootScope.currentSchemeType = currentSchemeType;
		    	$location.path('/compareAndModify');
		    }



		    $scope.getSchemeCount = function() {
		    	var goalType = $rootScope.currentGoal;
		    	// var assetType = $scope.currentSchemeType;
		    	var assetType = $rootScope.currentSchemeType;
		    	busyIndicator.show();
		    	recommendedService.resetCompareScheme(goalType,assetType).then(function(data){
		    		if('success' in data){
		    			busyIndicator.hide();
		    			$scope.schemeList = data.success;
		    			$scope.schemeListNumber = $scope.schemeList.scheme.length;

		    		} else {

		    		}
		    	});
		    }

		    

		    $scope.getAllFundsForGoal = function(currentSchemeType) {

		    	var goalType = $rootScope.currentGoal;
		    	var assetType = currentSchemeType;
		    	recommendedService.getFundsForGoal(goalType).then(function(data){
		    		if('success' in data){
		    			$scope.allFundIds = {
		    				"equity": [],
				    		"debt": [],
				    		"elss": [],
				    		"liquid": []
		    			};
		    			var schemeTypes = ['debt','elss','equity','liquid'];
		    			for(var i=0; i<schemeTypes.length; i++){
		    				var schemeTypei = schemeTypes[i];
		    				var currentSchemei = data.success[schemeTypei]['scheme'];
		    				currentSchemei.forEach(function(data){
		    					$scope.allFundIds[schemeTypei].push(data.id);
		    				});
		    				
		    			}
		    			console.log('$scope.allFundIds',$scope.allFundIds);
		    			console.log('Success data get all funds', data);
		    			if(assetType in data.success) {
		    				$scope.schemeList = data.success[assetType];
		    				console.log('$scope.schemeList',$scope.schemeList);
		    			}
		    			

		    		} else {

		    		}
		    	});
		    }

		    if($location.$$path == "/compareAndModify")
		    {
		    	$scope.getSchemeCount($rootScope.currentSchemeType);
		    	$scope.getAllFundsForGoal($rootScope.currentSchemeType);	
		    }
		    

		    $scope.addToRecommended = function(currentObj, index) {
		    	
		    	if($scope.schemeList['scheme'].length >= $scope.schemeListNumber){
		    		$scope.shoeSchemeNumberError = 1;
		    		$timeout(function() {
					    $scope.shoeSchemeNumberError = false;
					}, 3000);
		    	} else {
		    		$scope.schemeList['scheme'].push(currentObj);
		    		$scope.schemeList['other recommended'].splice(index,1);
		    	}
		    	
		    }

		    $scope.addToOthers = function(currentObj, index) {
		    	$scope.schemeList['other recommended'].push(currentObj);
		    	var recSchemes = $scope.schemeList.scheme;
		    	recSchemes.splice(index,1);
		    }

		    $scope.validateGoals = function(scheme) {
		    
		    	var currentScheme = $rootScope.currentSchemeType;
		    	var goalType = $rootScope.currentGoal;
		    	$scope.allFundIds[currentScheme] = [];
		    	scheme.forEach(function(element){
		    		$scope.allFundIds[currentScheme].push(element.id);
		    	});
		    	if($scope.allFundIds[currentScheme].length > 0 && $scope.allFundIds[currentScheme].length <= $scope.schemeListNumber){
		    		busyIndicator.show();
			    	recommendedService.validateCompareModifyScheme($scope.allFundIds, goalType).then(function(data){
			    		if('success' in data){
			    			if(data.success.valid == true){
			    				$scope.saveCompareModifyScheme($scope.allFundIds, goalType);
			    			}
			    		}
			    		else {

			    		}
			    	});
		    	} 
		    }

		    $scope.saveCompareModifyScheme = function(allFundIds, goalType) {
		    	
		    	recommendedService.saveCompareModifyScheme(allFundIds, goalType).then(function(data){
		    		if('success' in data){
		    			goalsService.getFundSelection(goalType).then(function(data){
					
							if('success' in data){	
								$rootScope.setFundData = data.success;
								
								$location.path('/recommendedSchemes');
								busyIndicator.hide();
							} else {
								console.log(data.Message);
							}
						});
		    		}
		    		else{

		    		}
		    	});
		    }

		    $scope.getFactsheet = function(schemeId) {
		    	recommendedService.getFactsheetData(schemeId).then(function(data){
		    		if('success' in data){
		    			$rootScope.factsheetData = data.success;

		    			$location.path('/schemeFactsheet')
		    		}	
		    		else {

		    		}
		    	});
		    }

		    $scope.getNumber = function(num){
		    	var x=new Array(); 
    			for(var i=0;i<num;i++)
    				{ x.push(i+1); } 
    			return x;
		    }

			$scope.populateGraph = function(trackerDetails, defaultYear){
		    	recommendedService.getGraphData(trackerDetails).then(function(data) {
					$scope.response = data;
					// if(!$scope.setvalue){
					// 	var defaultYear = 'three_year';
					// }else {
					// 	var defaultYear = $scope.setvalue;
					// }
					// 	var defaultYear = 'three_year';

			    	recommendedService.getGraphResultSet($scope.response,defaultYear).then(function(data){
			    		$scope.resultSet = data;
			    		console.log('$scope.resultSet',$scope.resultSet,'defaultYear',defaultYear);
			    		if(!$scope.$$phase) $scope.$apply();
		    		});
		    	});
		    	
		    }

		    // $scope.populateGraph($rootScope.histPerformanceData, $scope.setvalue);

		    //Try to get this from service instead of rootscope variable
		    $scope.recommendedSchemesObject = $rootScope.setFundData;
		    if($scope.recommendedSchemesObject){
		    	$scope.recommendedSchemes = $scope.recommendedSchemesObject.goals_recommended_schemes[0].recommended_schemes;
		    	$scope.goalSummary = $scope.recommendedSchemesObject.goals_recommended_schemes[0].goal_summary;
		    	$scope.totalAnnualInvest = $scope.recommendedSchemesObject.goals_recommended_schemes[0].total_sum;
		    	console.log('Recommended Schemes', $scope.recommendedSchemes);
			}
		}
})();