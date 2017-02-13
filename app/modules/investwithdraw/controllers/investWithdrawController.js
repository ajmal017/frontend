(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw')
		.controller('investWithdrawController',investWithdrawController);

		investWithdrawController.$inject = ['$scope','$rootScope','$location','$filter','$http','investWithdrawService','busyIndicator', 'ngDialog', '$interpolate', '$routeParams']
		function investWithdrawController($scope,$rootScope,$location,$filter,$http,investWithdrawService, busyIndicator, ngDialog, $interpolate, $routeParams){

			$scope.withdraw = {};
			$rootScope.totalAmt = 0;
			$scope.withdrawError = 0;

			$scope.proceedWithdraw = function(modelObj) {
				console.log('modelObj',modelObj);

				var resultObj = {};
				resultObj.data = [];
				var all_amounts = modelObj.amount;
				var all_units = modelObj.all_units;

				if(modelObj.amount){
					for( var goalId in all_amounts) {
						console.log('amount', all_amounts[goalId]);
						console.log('goalId', goalId);
						var result_goal = {};
						result_goal.goal_id = goalId
						console.log('length',Object.keys(all_amounts[goalId]).length);
							
							result_goal.amount = [];
							result_goal.all_units = [];
							result_goal.cancel_sips = [];
							if(all_amounts[goalId]){
								for(var fundId in all_amounts[goalId]) {
									if (all_amounts[goalId][fundId] > 0 && !(all_units && all_units[goalId] && all_units[goalId][fundId])) {
										var pushFund = {
											"fund_id" : fundId,
											"redeem_amount" : all_amounts[goalId][fundId]
										}
										result_goal.amount.push(pushFund);
									}
								}
							}

							if(all_units){
								for(var fundId in all_units[goalId]) {
									if(all_units[goalId][fundId] == true){
										var pushUnits = {
											"fund_id" : fundId
										}
										result_goal.all_units.push(pushUnits);
									}
								}
							}

							console.log('result_goal',result_goal);
							resultObj.data.push(result_goal);
					}
					console.log('result Obj', resultObj);
					busyIndicator.show();
					investWithdrawService.postWithdrawDetails(resultObj).then(function(data){
						busyIndicator.hide();
						if('success' in data) { 
							console.log('data success',data);
							$scope.errorPopupMessage = 'We have received your withdrawal request. Funds will be transferred into your registered bank account once it is processed.';
							$scope.confirmShowButton = false;
							$scope.ngDialog = ngDialog;
							ngDialog.open({ 
					        	template: 'modules/common/views/partials/error_popup.html', 
					        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
					        	overlay: false,
					        	showClose : false,

					        	scope: $scope,
					        	preCloseCallback:function(){
									$location.path('/dashboard');
					        	}
				        	});

						}
						else {
							busyIndicator.hide();
						}
					}, function() {busyIndicator.hide();});
				} else {
					$scope.disableWithdraw = true;
				}



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

			$scope.payInvest = function(totalSum){

				if($rootScope.is_bank_supported == false) {
					
					$scope.ngDialog = ngDialog;
					$scope.modalErrorMessage = 'Thank you for your order request. Please confirm to receive payment instructions.'
					$scope.confirmShowButton = true;
					ngDialog.openConfirm({ 
			        	template: 'modules/common/views/partials/confirmText.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope,
					}).then(function(confirm){
		        		investWithdrawService.investBankUnsupported(totalSum).then(function(data){
							if('success' in data) {
								$scope.errorPopupMessage = 'Your bank is not supported by our payment gateway. You will soon receive an email with payment instructions using other options (Cheque payment).';
								ngDialog.open({ 
						        	template: 'modules/common/views/partials/error_popup.html', 
						        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
						        	overlay: false,
						        	showClose : false,

						        	scope: $scope,
						        	preCloseCallback:function(){
						        		$location.path('/dashboard');

						        	}
					        	});
							} else {

							}
						});

		        	}, function(reject){
		        		
		        	});
				} else {
					
					$scope.modalErrorMessage = 'You will now be redirected through a secure Payment Gateway (BillDesk) to your bank account.\n\nYour payment will be credited to Indian Clearing Corporation Limited (a Bombay Stock Exchange subsidiary) for your purchase.'
					$scope.ngDialog = ngDialog;
					ngDialog.openConfirm({ 
			        	template: 'modules/common/views/partials/confirmText.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope,
			        	
		        	}).then(function(confirm){
		        		$scope.confirmPayment(totalSum);
		        	}, function(reject){
		        		
		        	});
				}
			}

			$scope.confirmPayment = function(totalSum) {
				busyIndicator.show();
				investWithdrawService.investCheckSum(totalSum).then(function(data){
					busyIndicator.hide();
					if('success' in data) {
						console.log('check sum', data.success);
						$scope.redirectToPayment(data.success);

					} else {

					}
				});
			}


			$scope.redirectToPayment = function(data){
				$scope.billdeskData = {
					"X-Requested-With" : "",
					"hidRequestId" : "PGIME1000",
					"hidOperation" : "ME100",
					"msg" : data
				}
				var form = $interpolate('<form action="https://www.billdesk.com/pgidsk/PGIMerchantRequestHandler/" method="POST"><div><input name="X-Requested-With" value="{{billdeskData.X-Requested-With}}" type="hidden"><input name="hidRequestId" value="{{billdeskData.hidRequestId}}" type="hidden"><input name="hidOperation" value="{{billdeskData.hidOperation}}" type="hidden"><input name="msg" value="{{billdeskData.msg}}" type="hidden"></div></form>')($scope)
				 jQuery(form).appendTo('body').submit();
				
			}

			$scope.getPaymentConfirmed = function() {
				$scope.txn_amount = parseInt($routeParams.txn_amount);
				$scope.message = $routeParams.message;
				$scope.apiStatus = $routeParams.api_status;
				$scope.auth_status = $routeParams.auth_status;
				$scope.order_id = $routeParams.order_id;
			}

			if($location.$$path == '/investmentReturn') {
				$scope.getPaymentConfirmed();
			}

			$scope.getTotalCurrentValue = function(value) {
				var returnValue = 0;
				value['funds'].forEach(function(data) {
					data['value'].forEach(function(eachFund) {
						returnValue = +returnValue + +eachFund.return_value;
					})
				});
				return returnValue;
			}

			$scope.getTotal = function(amt,goalId) {
				
				var withdrawTotal = 0;
				if(amt['amount'] && goalId){
					for(var keys in amt['amount'][goalId]){
						if(amt['amount'][goalId].hasOwnProperty(keys)) {
							
							withdrawTotal = +withdrawTotal + +amt['amount'][goalId][keys];
						}
					}
				}
				
				$rootScope.totalAmt = $rootScope.totalAmt + withdrawTotal;
				return withdrawTotal;
				
				// amt['amount'].forEach(function(value) {
				// 	console.log('value',value);
				// })
			}

			$scope.validateRedeem = function(schemeObj, amount, goalId) {
				// console.log('schemeObj',schemeObj, 'amount',amount, 'goalId',goalId);
				

				var current_goalId = goalId['goal_id'];
				var current_fundId = schemeObj['fund_id'];

				$scope.showErrorMessage = {};
				var each_goal_error = $scope.showErrorMessage[current_goalId];
				
				if (schemeObj.return_value == amount || amount == 0) {
					$scope.showErrorMessage[current_goalId] = '';
					$scope.withdrawError = 0;
				}
				else if((amount > 0 && schemeObj.minimum_withdrawal > 0) && (amount < schemeObj.minimum_withdrawal)) {
					
					var str = 'Please enter amount above minimum withdrawal limit \u20B9 ' + schemeObj.minimum_withdrawal;
					$scope.showErrorMessage[current_goalId] = str;
					
					$scope.withdrawError = 1;
				} else if((schemeObj.return_value-amount) < schemeObj.minimum_balance) {
						$scope.showErrorMessage[current_goalId] = 'The balance after withdrawal cannot be below minimum balance \u20B9 ' + schemeObj.minimum_balance;
						$scope.withdrawError = 1;
				} else {
						$scope.showErrorMessage[current_goalId] = '';
						$scope.withdrawError = 0;
				}
				
				

				return $scope.showErrorMessage[current_goalId];
			}

			$scope.getTotalWithdrawAmt = function(withdrawObj) {
			
			 	var totalWithdraw = 0
			 	if (withdrawObj.amount) {
				 	for(var goal in withdrawObj.amount) {
				 		for(var each_amt in withdrawObj.amount[goal]) {
				 			var parseAmt = parseFloat(withdrawObj.amount[goal][each_amt]);
				 			if (isNaN(parseAmt) == false) {
				 				totalWithdraw += parseAmt;
				 			}
				 		}
				 	}
			 	}
			 	return totalWithdraw;
			}
		}
})();