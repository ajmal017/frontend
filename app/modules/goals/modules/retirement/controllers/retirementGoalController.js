(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('retirementGoalsController',retirementGoalsController);

		retirementGoalsController.$inject = ['$scope','$rootScope','$route','$location',
		                                     'goalsService','retirementGoalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig', 'busyIndicator']
		function retirementGoalsController($scope,$rootScope,$route,$location,goalsService,retirementGoalsService, 
											assetAllocationService, goalFormulaeService, appConfig, busyIndicator) {
			$scope.retirement = {};
			$scope.modelVal = retirementGoalsService.getSavedValues();
			$rootScope.setFundData = {};
			$scope.budgetInfoText = [{'tip' : '<h5>A Budget Retirement would mean:</h5><p>You will get 40% of your current monthly income, adjusted for inflation, every month post retirement. With lower regular expenses, this would imply a somewhat lower lifestyle than you currently maintain.</p><h5>How the estimated value is calculated:</h5><ul><li>Your current income is projected to future value at 6% inflation, and income replacement of 40% is applied.</li><li> Life expectancy is taken as 80 years, or 20 years post retirement, whichever is higher.</li> <li>The total amount required at the time of retirement is calculated, to give you the required monthly income.</li> <li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
			$scope.comfInfoText = [{'tip' : '<h5>A Comfortable Retirement would mean:</h5><p>You will get 60% of your current monthly income, adjusted for inflation, every month post retirement. With lower regular expenses, this would imply a similar lifestyle as you currently maintain.</p><h5>How the estimated value is calculated:</h5><ul><li>Your current income is projected to future value at 6% inflation, and income replacement of 60% is applied.</li><li>Life expectancy is taken as 80 years, or 20 years post retirement, whichever is higher. </li><li>The total amount required at the time of retirement is calculated, to give you the required monthly income.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
			$scope.luxuInfoText = [{'tip' : '<h5>A Luxury Retirement would mean:</h5><p>You will get 80% of your current monthly income, adjusted for inflation, every month post retirement. With lower regular expenses, this would imply a somewhat better lifestyle than you currently maintain.</p><h5>How the estimated value is calculated:</h5><ul><li>Your current income is projected to future value at 6% inflation, and income replacement of 80% is applied. </li><li>Life expectancy is taken as 80 years, or 20 years post retirement, whichever is higher.</li><li>The total amount required at the time of retirement is calculated, to give you the required monthly income.</li><li>Any existing savings for this goal is projected to grow at 8% annually, and reduced from the target amount.</li><li>The monthly savings required is calculated based on projected investment growth.</li></ul>'}];
			$scope.loadDefaultValues = function() {
				if($rootScope.userFlags['user_answers']['retirement']['goal_plan_type'] == 'op2')
                {
                    $rootScope.selectedCriteria = 'op2';
                }
				if($rootScope.userFlags['user_answers']['retirement']['goal_plan_type'] == 'op1')
                { 
                    $rootScope.selectedCriteria = 'op1';
                } 

			}

			if($location.$$path == '/retirementGoalsStarted'){
				$scope.loadDefaultValues();
			}

			$scope.getGraphObject = function() {
				if (!$scope.graphObject) {
					$scope.graphObject = goalsService.initGoalGraphDetails();
				}
				return $scope.graphObject;
			}
            $scope.graphObject = $scope.getGraphObject();

			$scope.reloadRoute = function(param) {
				$rootScope.selectedCriteria = param;
				if(!$rootScope.$$phase) $rootScope.$apply();
				$rootScope.slideTobeChanged = 2;
			    $route.reload();
			}
			$scope.sendValues = function(value){
				console.log('Send values',value);
				value.goal_plan_type = $rootScope.selectedCriteria;
				retirementGoalsService.setSavedValues(value);
			}
			$scope.calculateYear = function(from,to){
				var currentYear = new Date();				
				$scope.retirement['calculateYear'] = currentYear.getFullYear() + ($scope.modelVal.A3 - $scope.modelVal.A2);
				$scope.retirement['tenure'] = $scope.modelVal.A3 - $scope.modelVal.A2;
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
					$scope.modelVal.A5 = $scope.modelVal.A5 || $scope.retirement['perMonth']; 
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
				
				if ($scope.modelVal.A5 == $scope.retirement.perMonth)
					return;
				
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
				$scope.modelVal.assetAllocation.equityInitial = assetAllocationObj.equity;
				var debtAmount = (assetAllocationObj.debt/100) * sipAmount;
				var equityAmount = (assetAllocationObj.equity/100) * sipAmount;
				$scope.modelVal.debtAmount = debtAmount;
				$scope.modelVal.equityAmount = equityAmount;
				$rootScope.modelValInitial = $scope.modelVal;
				$scope.getGoalGraphDetails();
			}
			
			$scope.calculateEstimates = function(currentAge, retirementAge, monthlyIncome, amountSaved) {
				if (!$scope.retirement['tenure']) {
					$scope.calculateYear();
					$scope.getAssetAllocationCategory();
				}
				retirementGoalsService.getCorpusEstimates(currentAge, retirementAge, monthlyIncome, amountSaved).then(function(data){
					if('success' in data){
						console.log("Success goal_estimation: " + data.success['goal_estimation']);
						var goalCorpusEstimates = data.success['goal_estimation'],
							goalEstimates = {};
						
						for (var i=0; i<goalCorpusEstimates.length; i++) {
							var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': goalCorpusEstimates[i].corpus, 'tenure': retirementAge - currentAge }, $scope.retirement['assetAllocationCategory']);
							goalEstimates[goalCorpusEstimates[i].estimate_type] = {'corpus': goalCorpusEstimates[i].corpus,
																'sip' : computedSIPData.computedSIP,
																'assetAllocation' : computedSIPData.assetAllocation};
						}
						$scope.retirement['goalEstimates'] = goalEstimates;
						if (!$scope.modelVal.estimate_selection_type) {
							$scope.modelVal.estimate_selection_type = 'op2';
							$scope.estimateSelectionChanged(appConfig.estimateType.COMFORTABLE);
						}
						else if (!$scope.retirement.corpus && $scope.modelVal.A5) {
							$scope.calculateCorpus($scope.modelVal.A5);
						}
					}
				});
			}
			
			$scope.estimateSelectionChanged = function(selectionType) {
				
				$scope.modelVal.A4 = $scope.retirement.goalEstimates[selectionType].corpus;
				$scope.modelVal.A5 = $scope.retirement.goalEstimates[selectionType].sip;
				$scope.retirement['corpus'] = $scope.retirement.goalEstimates[selectionType].corpus;
				$scope.retirement['perMonth'] = $scope.retirement.goalEstimates[selectionType].sip;
				$scope.retirement['assetAllocation'] = $scope.retirement.goalEstimates[selectionType].assetAllocation;
				
				$scope.setModelVal($scope.retirement['assetAllocation'], $scope.retirement['perMonth']);

			}

			$scope.getGoalGraphDetails = function() {
				goalsService.getGoalGraphDetails($scope.graphObject, $scope.modelVal.assetAllocation, $scope.modelVal.A5, 0, $scope.retirement['tenure']);

				console.log('$scope.graphObject',$scope.graphObject);
			}

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

				$scope.minAmount = 1000;
				$('#equiDeptModal').modal('show');
			}

			$scope.saveEquityDebtMix = function() {
				console.log('Saved mix');
				$scope.modelVal.assetAllocation.debt = $scope.equity;
				$scope.modelVal.assetAllocation.equity = $scope.equity2;
				$scope.modelVal.debtAmount = $scope.debtAmountModal;
				$scope.modelVal.equityAmount = $scope.equityAmountModal;
				$('#equiDeptModal').modal('hide');
				$scope.getGoalGraphDetails();
			}

			$scope.changeDebtModal = function() {
				console.log('debt', $scope.equity);
				$scope.equity2 = 100 - $scope.equity;
				$scope.debtAmountModal = Math.round(($scope.equity/100) * $scope.amount);
				$scope.equityAmountModal = Math.round(($scope.equity2/100) * $scope.amount);

			}

			$scope.changeEquityModal = function() {
				console.log('equity',$scope.equity2);
				$scope.equity = 100 - $scope.equity2;
				$scope.equityAmountModal = Math.round(($scope.equity2/100) * $scope.amount);
				$scope.debtAmountModal = Math.round(($scope.equity/100) * $scope.amount);
			}

			$scope.resetAllocation = function(equityInitial) {
				$scope.modelVal = $rootScope.modelValInitial;
				$scope.modelVal.assetAllocation.equity = equityInitial;
				$scope.modelVal.assetAllocation.debt = 100 - equityInitial;
				$scope.modelVal.debtAmount = ($scope.modelVal.assetAllocation.debt/100) * $scope.amount;
				$scope.modelVal.equityAmount = ($scope.modelVal.assetAllocation.equity/100) * $scope.amount;
				$scope.getGoalGraphDetails();
				console.log('modelVal',$scope.modelVal);
				
			}

			$scope.fundSelectionRetirement = function(modelVal) {
				console.log("In fund selection", modelVal);
				console.log('Selected criteria', $rootScope.selectedCriteria);

				var fundSelectionObj = {};
				if($rootScope.selectedCriteria == 'op1') {
					fundSelectionObj.goal_plan_type = modelVal.goal_plan_type;
					fundSelectionObj.current_age = modelVal.A2;
					fundSelectionObj.floating_sip = false;
					fundSelectionObj.grow_sip = '0';
					fundSelectionObj.monthly_investment = modelVal.A5;
					fundSelectionObj.corpus = modelVal.A4;
					fundSelectionObj.retirement_age = modelVal.A3;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					},
					fundSelectionObj.goal_name = modelVal.A1;
				}

				if($rootScope.selectedCriteria == 'op2') {
					fundSelectionObj.goal_plan_type = modelVal.goal_plan_type;
					fundSelectionObj.amount_saved = modelVal.A8;
					fundSelectionObj.estimate_selection_type = modelVal.estimate_selection_type;
					fundSelectionObj.current_age = modelVal.A2;
					fundSelectionObj.floating_sip = false;
					fundSelectionObj.grow_sip = '0';
					fundSelectionObj.monthly_income = modelVal.A6;
					fundSelectionObj.monthly_investment = modelVal.A5;
					fundSelectionObj.corpus = modelVal.A4;
					fundSelectionObj.retirement_age = modelVal.A3;
					fundSelectionObj.allocation = {
						"debt" : modelVal.assetAllocation.debt,
						"equity" : modelVal.assetAllocation.equity,
						"elss" : "0",
						"liquid" : "0"
					}
				}

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