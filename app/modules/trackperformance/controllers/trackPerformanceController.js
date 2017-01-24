(function(){
	'use strict';
	angular
		.module('finApp.trackPerformance')
		.controller('trackPerformanceController',trackPerformanceController);

		trackPerformanceController.$inject = ['$scope','$rootScope','$http','$location','$filter','trackPerformanceService','recommendedService', 'busyIndicator']
		function trackPerformanceController($scope,$rootScope,$http,$location,$filter,trackPerformanceService,recommendedService, busyIndicator){
				
			$scope.allFunds = '';	
			$scope.trackerDetails = '';
			$scope.resultSet = '';
			$scope.setChartValue = $rootScope.trackPerTab || 'SCHEME';


			$scope.getGoalImg = function(goalType) {
				//console.log('goalType',goalType.goal_type);
				var goal = goalType.goal_type;
				var goalImg = ''
				switch(goal){
					case 'retirement' : goalImg = 'retirement.png';
					break;
					case 'tax' : goalImg = 'saveTax.png';
					break;
					case 'invest' : goalImg = 'planInvestMent.png';
					break;
					case 'vacation' : goalImg = 'vacation.png';
					break;
					case 'property' : goalImg = 'property.png';
					break;
					case 'education' : goalImg = 'education.png';
					break;
					case 'automobile' : goalImg = 'automobile.png';
					break;
					case 'wedding' : goalImg = 'wedding.png';
					break;
				}
				return goalImg;
			}

			$scope.showFinancialGoalModal = function (modelObj) {
		    	$scope.finGoalsModal = modelObj;
		    	$scope.finGoalsModal.goalImgModal =  $scope.getGoalImg(modelObj);
		    	$scope.finGoalsModal.schemes = $scope.allSchemes;
		    	$scope.finGoalsModal.sip = getSip(modelObj);
		    	$scope.finGoalsModal.lumpsum = getLumpsum(modelObj);

		    	function getSip(modelObj){
		    		if(modelObj.goal_type == 'retirement') {
		    			return modelObj.goal_answers.monthly_investment
		    		} else {
		    			return modelObj.goal_answers.sip;
		    		}
		    	}

		    	function getLumpsum(modelObj){
		    		if(modelObj.goal_type == 'tax') {
		    			return modelObj.goal_answers.amount_invested;
		    		} else {
		    			return modelObj.goal_answers.lumpsum;
		    		}
		    	}

				$('#finGoalStatusModal').modal('show');
				console.log('Modal',$scope.finGoalsModal);

			}
		 //    $scope.resultPercentage = [
			// 	['Equity',   30],
			// 	['Debt',     20],
			// 	['ELSS',     25],
			// 	['LIQUID',     25]
			// ];
			// $scope.colors = ["#0486d4","#047ac1","#046eae","#03629a"];


			$scope.portfolioDetails = function() {
				busyIndicator.show();
				trackPerformanceService.getPortfolioDetails().then(function(data){
					busyIndicator.hide();
					if('success' in data) {
						$scope.allFunds = data.success.asset_class_overview;
						$scope.dashboardDetails();
					} else {

					}
				});
			}

			$scope.dashboardDetails = function() {
				busyIndicator.show();
				trackPerformanceService.getDashboardDetails().then(function(data){
					busyIndicator.hide();
					if('success' in data) {
						$scope.portfolioStatus = data.success.portfolio_overview;
						$scope.yestChanges = data.success.yesterday_changes;
						$scope.financial_goal_status = data.success.financial_goal_status;
						$scope.financial_goal_status.forEach(function(data){
							var date = new Date(data.date);
							console.log('date',date);
							data.dateFormatted = date;
						});
						$scope.allSchemes = data.success.asset_class_overview;
						console.log('allFunds',$scope.allFunds);
						$scope.resultPercentage = [];
						$scope.allSchemes.forEach(function(data,key) {
							data.funds = $scope.allFunds[key].value;
							
						});
						console.log('allSchemes',$scope.allSchemes);
						if($scope.allSchemes[0]){
							var equityValue = $scope.allSchemes[0]['holding_per'];
						} else {equityValue = 0;}
						if($scope.allSchemes[1]){
							var debtValue = $scope.allSchemes[1]['holding_per'];
						} else {debtValue = 0;}
						if($scope.allSchemes[2]){
							var elssValue = $scope.allSchemes[2]['holding_per'];
						} else {elssValue = 0;}
						if($scope.allSchemes[3]){
							var liquidValue = $scope.allSchemes[3]['holding_per'];
						} else {liquidValue = 0;}
						$scope.resultPercentage = [
							['Equity',   equityValue],
							['Debt',     debtValue],
							['ELSS',     elssValue],
							['LIQUID',     liquidValue]
						];
						
						console.log('resultPercentage',$scope.resultPercentage);
						$scope.colors = [];
						$scope.legendColors = [];
						var init = 0.2;
						for(var i=0;i<$scope.resultPercentage.length;i++){
							init = init - 0.1 ;
							var color = trackPerformanceService.getHexcolors('#047ac1',init);
							$scope.colors.push(color);
						}
						$scope.legendColors = $scope.colors;
						console.log('colors',$scope.colors);
						var pieCurrency =  $filter('amountSeffix')(1200000);
						$scope.pieTitle = "<p><span class='currency'>&#8377;</span><span class='content'>"+pieCurrency+"</span><span class='nextline'>Returns 0%</span></p>";
						
						
						$scope.legends = [];
						var init = 0.2;
						for(var i=0;i<$scope.resultPercentage.length;i++){
							init = init - 0.1 ;
							var color = trackPerformanceService.getHexcolors('#047ac1',init);
							$scope.legendColors.push(color);
						}
						
						var price = ['524920030', '1020320030', '1020320030', '1020320030'];
						for(var i=0;i<$scope.resultPercentage.length;i++){
							var legendObject = {};
							legendObject['name'] = $scope.resultPercentage[i][0];
							legendObject['value'] = $scope.resultPercentage[i][1];
							legendObject['price'] = price.splice(0,1).toString();
							legendObject['color'] = $scope.legendColors.splice(0,1).toString();
							legendObject['borderColor'] = '10px solid '+legendObject['color'];
							$scope.legends.push(legendObject);
							console.log('Legends',$scope.legends);
						}
					} else {
						
					}
				});
			}

			$scope.populateGraph = function(trackerDetails){
		    	trackPerformanceService.getGraphData(trackerDetails).then(function(data) {
					$scope.response = data;
					var defaultYear = 'three_year';
			    	trackPerformanceService.getGraphResultSet($scope.response,defaultYear).then(function(data){
			    		$scope.resultSet = data;
			    		console.log('$scope.resultSet',$scope.resultSet);
			    		if(!$scope.$$phase) $scope.$apply();
		    		});
		    	});
		    	

		    }

			$scope.portfolioTrackerDetails = function() {
				busyIndicator.show();
				trackPerformanceService.getPortfolioTracker().then(function(data){
					busyIndicator.hide();

					if('success' in data) {
						$scope.trackerDetails = data.success;
						$scope.populateGraph($scope.trackerDetails);
					} else {
						
					}
				});
			}

			

			$scope.transactionHistoryDetails = function() {
				busyIndicator.show();
				trackPerformanceService.getTransactionHistory().then(function(data){
					busyIndicator.hide();
					if('success' in data) {
						$scope.transactionHistory = data.success;
						console.log('transactionHistory',$scope.transactionHistory);
					} else {
						
					}
				});
			}

			$scope.getWidth = function(finGoalsModal) {
				
				if(finGoalsModal){
					return {
						"width":finGoalsModal.progress + "%"
					};
				}
			}

		    
			$scope.portfolioDetails();
			
			$scope.portfolioTrackerDetails();
			// $scope.leaderBoardDetails();
			$scope.transactionHistoryDetails();

			$scope.calculateTotalSIP = function(SIPModel) {
				
				var SIPTotal = 0;
				SIPModel.forEach(function(data) {
					SIPTotal = SIPTotal + data.agreed_sip;
				});
				return SIPTotal;
			}

			$scope.calcaulateLumpsum = function(lumpsum) {
				
				var lumpsumTotal = 0;
				lumpsum.forEach(function(data){
					lumpsumTotal = lumpsumTotal + data.agreed_lumpsum;
				});
				return lumpsumTotal;
			}
			
		}
})();