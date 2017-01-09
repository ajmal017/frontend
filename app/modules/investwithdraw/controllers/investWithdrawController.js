(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw')
		.controller('investWithdrawController',investWithdrawController);

		investWithdrawController.$inject = ['$scope','$rootScope','$location','$filter','$http','investWithdrawService','busyIndicator', 'ngDialog', '$interpolate', '$routeParams']
		function investWithdrawController($scope,$rootScope,$location,$filter,$http,investWithdrawService, busyIndicator, ngDialog, $interpolate, $routeParams){

			$scope.withdraw = {};
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
					busyIndicator.show();
					investWithdrawService.getInvestDetails().then(function(data){
						busyIndicator.hide();
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

			$scope.goToWithdraw = function() {
				$scope.noWithdraw = false;
				if($rootScope.userFlags['user_flags']['show_redeem'] == false) {
						$scope.errorPopupMessage = 'You cannot withdraw.';
						$scope.ngDialog = ngDialog;
						ngDialog.open({ 
				        	template: 'modules/common/views/partials/error_popup.html', 
				        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
				        	overlay: false,
				        	showClose : false,

				        	scope: $scope
			        	});
				} else {
						busyIndicator.show();
						investWithdrawService.getWithdrawDetails().then(function(data){
							busyIndicator.hide();
						if('success' in data) { 
							if(!data.success.length)
							{
								$rootScope.noWithdraw = true;
							}
							console.log('redeem', data);
							$rootScope.redeemData = data.success;
							$location.path('/withdrawStart');
						}
						else {
							
						}
				});
				}
			}

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
									var pushFund = {
										"fund_id" : fundId,
										"redeem_amount" : all_amounts[goalId][fundId]
									}
									result_goal.amount.push(pushFund);
								}
							}

							if(all_units[goalId]){
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
					
					investWithdrawService.postWithdrawDetails(resultObj).then(function(data){
						if('success' in data) { 
							console.log('data success',data);
							$location.path('/dashboard');
						}
						else {

						}
					});
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
					$scope.errorPopupMessage = 'Thank you for your order request. Please confirm to receive payment instructions.'
					$scope.confirmShowButton = true;
					ngDialog.open({ 
			        	template: 'modules/common/views/partials/error_popup.html', 
			        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
			        	overlay: false,
			        	showClose : false,

			        	scope: $scope,
			        	preCloseCallback:function(){
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
			        	}
		        	});
			
					
				} else {
					
					$scope.modalErrorMessage = 'You will now be redirected through a secure Payment Gateway (BillDesk) to your bank account.\n\nYour payment will be credited to Indian Clearing Corporation Limited (a Bombay Stock Exchange subsidiary) for your purchase.'
					
					ngDialog.openConfirm({ 
			        	template: '/modules/common/views/partials/confirmText.html', 
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
			
		}
})();