(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('educationController',educationController);

		educationController.$inject = ['$scope','$rootScope','$route','$location',
	                                     'goalsService','educationService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		                               
		function educationController($scope,$rootScope, $route, $location,
				goalsService, educationService, assetAllocationService, goalFormulaeService, appConfig) {
			
			$scope.education = {};
			$scope.modelVal = educationService.getSavedValues();
			$scope.showEquityModal = function(){
				$('#equiDeptModal').modal('show');
			}
			$scope.reloadRoute = function(param) {
				$rootScope.selectedCriteria = param;
				if(!$rootScope.$$phase) $rootScope.$apply();
				$rootScope.slideTobeChanged = 2;
			    $route.reload();
			}
			$scope.appendValues = function(value){
				educationService.setSavedValues(value);
			}
			$scope.getAssetAllocationCategory = function(){
				var currentYear = new Date(),
					tenure = $scope.modelVal.A2 - currentYear.getFullYear();
				
				$scope.education['tenure'] = tenure;
				
				assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
					if('success' in data){
						console.log("Success asset category: " + data.success['asset_allocation_category']);
						$scope.education['assetAllocationCategory'] = data.success['asset_allocation_category'];
					}
					else {
						$scope.education['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					$scope.$broadcast('assetAllocationCategoryChanged');
				});

			}
			$scope.calculateRecommendedSIP = function(corpus) {
				var calculateSIP = function() {
					var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': $scope.education['tenure'] }, $scope.education['assetAllocationCategory']);
					$scope.education['perMonth'] = computedSIPData.computedSIP;
					$scope.education['assetAllocation'] = computedSIPData.assetAllocation;
					$scope.modelVal.A4 = $scope.modelVal.A4 || $scope.education['perMonth']; 
					$scope.education['corpus'] = corpus;
				};
				
				if (!$scope.education['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
			}

			$scope.calculateCorpus = function(sipAmount) {
				var calculateCorpus = function() {
					var computedSIPData = goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'tenure': $scope.education['tenure'] }, $scope.education['assetAllocationCategory']);
					$scope.education['corpus'] = computedSIPData.computedCorpus;
					$scope.education['assetAllocation'] = computedSIPData.assetAllocation;
					console.log("calculateCorpus: " + JSON.stringify(computedSIPData.assetAllocation) + " corpus: " + computedSIPData.computedCorpus);
				};
				
				if ($scope.modelVal.A4 == $scope.education.perMonth)
					return;
				
				if (!$scope.education['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
			}
			
			$scope.calculateEstimates = function() {
				educationService.getCorpusEstimates($scope.education['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7).then(function(data){
					if('success' in data){
						console.log("Success goal_estimation: " + data.success['goal_estimation']);
						var goalCorpusEstimates = data.success['goal_estimation'],
							goalEstimates = {};
						
						for (var i=0; i<goalCorpusEstimates.length; i++) {
							var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': goalCorpusEstimates[i].corpus, 'tenure': $scope.education['tenure'] }, $scope.education['assetAllocationCategory']);
							goalEstimates[goalCorpusEstimates[i].estimate_type] = {'corpus': goalCorpusEstimates[i].corpus,
																'sip' : computedSIPData.computedSIP,
																'assetAllocation' : computedSIPData.assetAllocation};
						}
						
						$scope.education['goalEstimates'] = goalEstimates;
						if (!$scope.activeTab) {
							$scope.activeTab = "COMFORT";
							$scope.estimateSelectionChanged(appConfig.estimateType.COMFORTABLE);
						}
					}
				});
			}
			
			$scope.estimateSelectionChanged = function(selectionType) {
				
				$scope.modelVal.A3 = $scope.education.goalEstimates[selectionType].corpus;
				$scope.modelVal.A4 = $scope.education.goalEstimates[selectionType].sip;
				$scope.education['corpus'] = $scope.education.goalEstimates[selectionType].corpus;
				$scope.education['perMonth'] = $scope.education.goalEstimates[selectionType].sip;
				$scope.education['assetAllocation'] = $scope.education.goalEstimates[selectionType].assetAllocation;
			}

			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
})();