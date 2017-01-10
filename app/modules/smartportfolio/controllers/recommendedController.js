(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio')
		.controller('recommendedController',recommendedController);

		recommendedController.$inject = ['$rootScope','$scope','$http','$timeout','recommendedService', 'busyIndicator', '$location', 'goalsService', 'investWithdrawService', '$filter', 'ngDialog'];
		function recommendedController($rootScope,$scope,$http,$timeout,recommendedService, busyIndicator, $location, goalsService, investWithdrawService, $filter, ngDialog){
			
			$scope.recommendedSchemesObject = {}; 
			$scope.schemeList = {};
			// $('.seperate-cover').mCustomScrollbar();
			setTimeout(function(){
				$('.seperate-cover').mCustomScrollbar();
			},10);

			if($location.$$path == '/recommendedSchemes' || $location.$$path == '/compareAndModify'){
				$rootScope.subHeader = 'GO BACK TO '+ $rootScope.currentGoal.toUpperCase() +' GOAL';
				if($rootScope.currentGoal == 'liquid'){
					$rootScope.redirectURL = '/earnInterestStart';
				} else if($rootScope.currentGoal == 'invest'){
					$rootScope.redirectURL = '/quickInvestStart';
				} else if($rootScope.currentGoal == 'tax'){
					$rootScope.redirectURL = '/taxsavingStarted';
				} else if($rootScope.currentGoal == 'retirement'){
					$rootScope.redirectURL = '/retirementGoalsStarted';
				} else if($rootScope.currentGoal == 'event') {
					$rootScope.redirectURL = '/othersStarted';

				} else {
					$rootScope.redirectURL = '/'+ $rootScope.currentGoal +'Started'
				}
			}
			

			
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
		    			$scope.otherRecommendSchemes = $scope.schemeList['other recommended'];
		    			$scope.schemeTop = $scope.schemeList['scheme'];
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
		    				$scope.otherRecommendSchemes = $scope.schemeList['other recommended'];
		    				$scope.schemeTop = $scope.schemeList['scheme'];
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

		    $scope.selectedSchemes = function selectedSchemes() {
		    	return filterFilter($scope.otherRecommendSchemes, { selected: true });
		  	};

		  	$scope.selectedTop = function selectedTop() {
		    	return filterFilter($scope.schemeTop, { selected: true });
		  	}
		  	if($location.$$path == '/compareAndModify'){
			  	$scope.$watch('otherRecommendSchemes|filter:{selected:true}', function (nv) {
			  		if(nv){
				    $scope.selection = nv.map(function (data) {
				      return data.id;
				    });
				    $scope.selectedSchemes = $scope.selection;
				  console.log('schemes selected', $scope.selectedSchemes);
				  if($scope.selection.length < 1){
				  	$scope.disableAppend = true;
				  } else {
				  	$scope.disableAppend = false;
				  }
					}
				    
				}, true);
		  	}

		  	if($location.$$path == '/compareAndModify'){
			  	$scope.$watch('schemeTop|filter:{selected:true}', function (nv) {
			  		if(nv){
			  			$scope.selection1 = nv.map(function (data) {
				      		return data.id;
				    	});
				    	$scope.selectedTop = $scope.selection1;
						console.log('schemes selected top', $scope.selectedTop);
						if($scope.selection.length < 1){
						  	$scope.disableAppend = true;
						} else {
						  	$scope.disableAppend = false;
						}
			  		}
				   
				    
				}, true);
		  	}

		  	$scope.compareSchemes = function(selectedSchemes, selectedTop) {
		  		
		  		var finalArray = selectedSchemes.concat(selectedTop);
		  		console.log('finalArray',finalArray);
		  		busyIndicator.show();
		  		recommendedService.compareSchemes(finalArray).then(function(data){
		  			if('success' in data){
		  				$rootScope.schemeCompareAfter = data.success;
		  				console.log('$rootScope.schemeCompareAfter',$rootScope.schemeCompareAfter);
		  				$rootScope.ifEquitySchemes = $rootScope.schemeCompareAfter.equity_other_data.length > 0 ? true : false;
		  				$rootScope.ifDebtSchemes = $rootScope.schemeCompareAfter.debt_other_data.length > 0 ? true : false;
		  				recommendedService.compareSchemesGraph(finalArray).then(function(data){
		  					if('success' in data){
		  						busyIndicator.hide();
		  						$rootScope.schemeCompareGraph = data.success;
		  						$location.path('/schemeCompare');
		  					} else {

		  					}
		  				});
		  				
		  			} else {

		  			}
		  		});
		  	}

			$scope.goToInvest = function() {
				$rootScope.legends = [];
				var canInvest = true;

				if($rootScope.userFlags['user_flags']['portfolio'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You have to add goals before you can invest.';
					$scope.redirectPath = '/goals';	

				} else if($rootScope.userFlags['user_flags']['kra_verified'] == false) {
					canInvest = false;
					$scope.errorPopupMessage = 'You are not KRA verified. Kindly contact FinAskus team.';
					$scope.redirectPath = '/dashboard';	
				} else if($rootScope.userFlags['user_flags']['vault'] == false){
					canInvest = false;
					$scope.errorPopupMessage = 'You have to complete investor registration before you can invest';
					$scope.redirectPath = '/registerInvestorStart';
				} 

				if(canInvest == false){
					$scope.ngDialog = ngDialog;
					ngDialog.open({ 
			        	template: 'modules/common/views/partials/error_popup.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope,
			        	preCloseCallback:function(){
			        		$location.path($scope.redirectPath);
			        	}
		        	});
				}

				if(canInvest == true) {	
				investWithdrawService.getInvestDetails().then(function(data){
					if('success' in data) {
						$rootScope.sipTotal = 0;
						$rootScope.lumpSumTotal = 0;
						$rootScope.overall_total_sum = data.success['overall_total_sum'];
						$rootScope.recommended_schemes = data.success['goals_recommended_schemes'];
						$rootScope.recommended_schemes.forEach(function(data) {
							$rootScope.sipTotal+= data.goal_summary.sip;
							$rootScope.lumpSumTotal+= data.goal_summary.lumpsum;
						});	
						$scope.overall_allocation = data.success['overall_allocation'];
						$rootScope.resultPercentage = [
							['Equity',   $scope.overall_allocation.equity.percentage],
							['Debt',     $scope.overall_allocation.debt.percentage],
							['ELSS',     $scope.overall_allocation.elss.percentage],
							['LIQUID',     $scope.overall_allocation.liquid.percentage]
						];
						var colors = ['#0580c3', '#0c4f74', '#f26928', '#87350f'];
						var price = [$scope.overall_allocation.equity.amount, $scope.overall_allocation.debt.amount, $scope.overall_allocation.elss.amount, $scope.overall_allocation.liquid.amount];
						for(var i=0;i<$rootScope.resultPercentage.length;i++){
							var legendObject = {};
							legendObject['name'] = $rootScope.resultPercentage[i][0];
							legendObject['value'] = $rootScope.resultPercentage[i][1];
							legendObject['price'] = price.splice(0,1).toString();
							legendObject['color'] = colors.splice(0,1).toString();
							legendObject['borderColor'] = '10px solid '+legendObject['color'];
							$rootScope.legends.push(legendObject);
						}
						$rootScope.pieTitle = "<span class='currency'>&#8377;</span><span class='content'><span>" + $filter('amountSeffix')($rootScope.overall_total_sum) + " </span>";
						$location.path('/investStep1');
						
					} else {
						
					}
				});
			}
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