(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('retirementGoalsController',retirementGoalsController);

		retirementGoalsController.$inject = ['$scope','$rootScope','$route','$location',
		                                     'goalsService','retirementGoalsService', 'assetAllocationService', 'goalFormulaeService', 'busyIndicator']
		function retirementGoalsController($scope,$rootScope,$route,$location,goalsService,retirementGoalsService, 
											assetAllocationService, goalFormulaeService, busyIndicator) {
			$scope.retirement = {};
			$scope.modelVal = retirementGoalsService.getSavedValues();
			$rootScope.setFundData = {};

			$scope.reloadRoute = function(param) {
				$rootScope.selectedCriteria = param;
				if(!$rootScope.$$phase) $rootScope.$apply();
				$rootScope.slideTobeChanged = 2;
			    $route.reload();
			}
			$scope.sendValues = function(value){
				console.log('Send values',value);
				retirementGoalsService.setSavedValues(value);
			}
			$scope.calculateYear = function(from,to){
				var currentYear = new Date();				
				$scope.retirement['calculateYear'] = currentYear.getFullYear() + (to - from);
				$scope.retirement['tenure'] = to - from;
			}
			$scope.getAssetAllocationCategory = function(){
				var currentYear = new Date(),
					tenure = $scope.retirement['tenure'];
				
				assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
					if('success' in data){
						console.log("Success asset category: " + data.success['asset_allocation_category']);
						$scope.retirement['assetAllocationCategory'] = data.success['asset_allocation_category'];
						$scope.modelVal['assetAllocationCategory'] = $scope.retirement['assetAllocationCategory'];
					}
					else {
						$scope.retirement['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					$scope.$broadcast('assetAllocationCategoryChanged');
				});
				console.log('$scope.retirement',$scope.retirement);
			}
			$scope.calculateRecommendedSIP = function(corpus) {
				var calculateSIP = function() {
					var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': $scope.retirement['tenure'] }, $scope.retirement['assetAllocationCategory']);
					$scope.retirement['perMonth'] = computedSIPData.computedSIP;
					$scope.retirement['assetAllocation'] = computedSIPData.assetAllocation;
					$scope.modelVal.A5 = $scope.retirement['perMonth']; 
					$scope.retirement['corpus'] = corpus;
					console.log('computedSIPData',computedSIPData);
					$scope.setModelVal(computedSIPData.assetAllocation, computedSIPData.computedSIP);
					
				};
				
				if (!$scope.retirement['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
				console.log('$scope.retirement',$scope.retirement);
			}

			$scope.calculateCorpus = function(sipAmount) {
				var calculateCorpus = function() {
					var computedSIPData = goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'tenure': $scope.retirement['tenure'] }, $scope.retirement['assetAllocationCategory']);
					$scope.retirement['corpus'] = computedSIPData.computedCorpus;
					$scope.retirement['assetAllocation'] = computedSIPData.assetAllocation;
					console.log("calculateCorpus: " + JSON.stringify(computedSIPData.assetAllocation) + " corpus: " + computedSIPData.computedCorpus);
					$scope.setModelVal(computedSIPData.assetAllocation, sipAmount);
					
				};
				
				if (!$scope.retirement['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
					console.log('$scope.retirement',$scope.retirement);
			}

			$scope.setModelVal = function(assetAllocationObj, sipAmount) {
				$scope.modelVal.assetAllocation = assetAllocationObj;
					var debtAmount = (assetAllocationObj.debt/100) * sipAmount;
					var equityAmount = (assetAllocationObj.equity/100) * sipAmount;
					$scope.modelVal.debtAmount = debtAmount;
					$scope.modelVal.equityAmount = equityAmount;
			}

			$scope.graphObject = goalsService.getGoalGraphDetails();

			console.log('$scope.graphObject',$scope.graphObject);

			$scope.callModel = function(debtValue, equityValue, amount){
				$scope.amount = amount;
				console.log('called modal')
				$scope.equity = debtValue;
				$scope.equity2 = equityValue;
				console.log('$scope.equity', $scope.equity, '$scope.equity2', $scope.equity2);
				var debtAmount = ($scope.equity/100) * amount;
				var equityAmount = ($scope.equity2/100) * amount;
				$scope.debtAmountModal = debtAmount;
				$scope.equityAmountModal = equityAmount;

				$('#equiDeptModal').modal('show');
			}

			$scope.saveEquityDebtMix = function() {
				console.log('Saved mix');
				$scope.modelVal.assetAllocation.debt = $scope.equity;
				$scope.modelVal.assetAllocation.equity = $scope.equity2;
				$scope.modelVal.debtAmount = $scope.debtAmountModal;
				$scope.modelVal.equityAmount = $scope.equityAmountModal;
				$('#equiDeptModal').modal('hide');	
			}

			$scope.changeDebtModal = function() {
				console.log('debt', $scope.equity);
				$scope.equity2 = 100 - $scope.equity;
				$scope.debtAmountModal = ($scope.equity/100) * $scope.amount;
				$scope.equityAmountModal = ($scope.equity2/100) * $scope.amount

			}

			$scope.changeEquityModal = function() {
				console.log('equity',$scope.equity2);
				$scope.equity = 100 - $scope.equity2;
				$scope.equityAmountModal = ($scope.equity2/100) * $scope.amount
				$scope.debtAmountModal = ($scope.equity/100) * $scope.amount;
			}

			$scope.fundSelection = function(modelVal) {
				console.log("In fund selection", modelVal);
				var fundSelectionObj = {};
				fundSelectionObj.current_age = modelVal.A2;
				fundSelectionObj.floating_sip = false;
				fundSelectionObj.grow_sip = '0';
				fundSelectionObj.monthly_investment = modelVal.A5;
				fundSelectionObj.retirement_age = modelVal.A3;
				fundSelectionObj.allocation = {
					"debt" : modelVal.assetAllocation.debt,
					"equity" : modelVal.assetAllocation.equity,
					"elss" : "0",
					"liquid" : "0"
				},
				fundSelectionObj.goal_name = modelVal.A1;
				busyIndicator.show();
				retirementGoalsService.addRetirementGoal(fundSelectionObj).then(function(data){
					if('success' in data) {
						console.log('Goal added successfully');
						$scope.getFundData('retirement');
					}
					else {
						console.log('Error in service');
					}
				});
			}

			$scope.getFundData = function(goalType) {
				goalsService.getFundSelection(goalType).then(function(data){
					if('success' in data){
						busyIndicator.hide();
						$rootScope.setFundData = data.success;
						$location.path('/recommendedSchemes');
					} else {
						console.log(data.Message);
					}
				})
			}
		}

})();