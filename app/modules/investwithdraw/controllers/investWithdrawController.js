(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw')
		.controller('investWithdrawController',investWithdrawController);

		investWithdrawController.$inject = ['$scope','$rootScope','$location','$filter','investWithdrawService']
		function investWithdrawController($scope,$rootScope,$location,$filter,investWithdrawService){

			$scope.withdraw = {};
			$scope.goToInvest = function() {
				$rootScope.legends = [];

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

			$scope.goToWithdraw = function() {
				investWithdrawService.getWithdrawDetails().then(function(data){
					if('success' in data) { 
						console.log('redeem', data);
						$rootScope.redeemData = data.success;
						$location.path('/withdrawStart');
					}
					else {

					}
				});
			}

			$scope.proceedWithdraw = function(modelObj) {
				console.log('modelObj',modelObj);

				var resultObj = {};
				resultObj.data = [];
				var all_amounts = modelObj.amount;
				var all_units = modelObj.all_units;
				for( var goalId in all_amounts) {
					console.log('amount', all_amounts[goalId]);
					console.log('goalId', goalId);
					var result_goal = {};
					result_goal.goal_id = goalId
					console.log('length',Object.keys(all_amounts[goalId]).length);
						
						result_goal.amount = [];
						result_goal.all_units = [];
						result_goal.cancel_sips = [];
						for(var fundId in all_amounts[goalId]) {
							var pushFund = {
								"fund_id" : fundId,
								"redeem_amount" : all_amounts[goalId][fundId]
							}
							result_goal.amount.push(pushFund);
						}

						for(var fundId in all_units[goalId]) {
							if(all_units[goalId][fundId] == true){
								var pushUnits = {
									"fund_id" : fundId
								}
								result_goal.all_units.push(pushUnits);
							}
						}

					console.log('result_goal',result_goal);
					resultObj.data.push(result_goal);
				}
				console.log('result Obj', resultObj);
				
				investWithdrawService.postWithdrawDetails(resultObj).then(function(data){
					if('success' in data) { 
						console.log('data success',data);
						$location.path('/dashboard');
					}
					else {

					}
				});

			// {
			// 	"data": [
			// 	{
			// 		"goal_id": 1, 
			// 		"amount" : [{"fund_id": 3, "redeem_amount": 1300}], 
			// 		"all_units":[{"fund_id": 2}], 
			// 		"cancel_sips":[{"fund_id": 2},{"fund_id": 3}]
			// 	}
			// 	]
			// }
			}
			
		}
})();