(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio')
		.controller('recommendedController',recommendedController);

		recommendedController.$inject = ['$rootScope','$scope','$http','recommendedService', 'busyIndicator', '$location'];
		function recommendedController($rootScope,$scope,$http,recommendedService, busyIndicator, $location){
			
			$scope.recommendedSchemesObject = {}; 
			$scope.schemeList = {};
			// $('.seperate-cover').mCustomScrollbar();
			setTimeout(function(){
				$('.seperate-cover').mCustomScrollbar();
			},10);
			// $('.scheme-compare-other').mCustomScrollbar();
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
		    	
		    	$scope.schemeList['scheme'].push(currentObj);
		    	$scope.schemeList['other recommended'].splice(index,1);
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

		    $scope.saveCompareModifyScheme = function(allFundIds, goalType) {
		    	
		    	recommendedService.saveCompareModifyScheme(allFundIds, goalType).then(function(data){
		    		if('success' in data){
		    			busyIndicator.hide();
		    			console.log('Success');
		    			$location.path('/recommendedSchemes');
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
		    //Try to get this from service instead of rootscope variable
		    $scope.recommendedSchemesObject = $rootScope.setFundData;
		    if($scope.recommendedSchemesObject){
		    	$scope.recommendedSchemes = $scope.recommendedSchemesObject.goals_recommended_schemes[0].recommended_schemes;
		    	$scope.goalSummary = $scope.recommendedSchemesObject.goals_recommended_schemes[0].goal_summary;
		    	console.log('Recommended Schemes', $scope.recommendedSchemes);
			}
		}
})();