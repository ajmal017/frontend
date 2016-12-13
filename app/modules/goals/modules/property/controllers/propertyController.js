(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('propertyController',propertyController);

		propertyController.$inject = ['$scope','$rootScope','$location','propertyService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function propertyController($scope,$rootScope,$location,propertyService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			$scope.property = {};
			$scope.modelVal = propertyService.getSavedValues();
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
				propertyService.setSavedValues(value);
			}
			$scope.getAssetAllocationCategory = function(){
				var currentYear = new Date(),
					tenure = $scope.modelVal.A2 - currentYear.getFullYear();
				
				$scope.property['tenure'] = tenure;
				
				assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
					if('success' in data){
						console.log("Success asset category: " + data.success['asset_allocation_category']);
						$scope.property['assetAllocationCategory'] = data.success['asset_allocation_category'];
					}
					else {
						$scope.property['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					$scope.$broadcast('assetAllocationCategoryChanged');
				});

			}
			$scope.calculateRecommendedSIP = function(corpus) {
				var calculateSIP = function() {
					var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': $scope.property['tenure'] }, $scope.property['assetAllocationCategory']);
					$scope.property['perMonth'] = computedSIPData.computedSIP;
					$scope.property['assetAllocation'] = computedSIPData.assetAllocation;
					$scope.modelVal.A4 = $scope.modelVal.A4 || $scope.property['perMonth']; 
					$scope.property['corpus'] = corpus;
				};
				
				if (!$scope.property['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
			}

			$scope.calculateCorpus = function(sipAmount) {
				var calculateCorpus = function() {
					var computedSIPData = goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'tenure': $scope.property['tenure'] }, $scope.property['assetAllocationCategory']);
					$scope.property['corpus'] = computedSIPData.computedCorpus;
					$scope.property['assetAllocation'] = computedSIPData.assetAllocation;
					console.log("calculateCorpus: " + JSON.stringify(computedSIPData.assetAllocation) + " corpus: " + computedSIPData.computedCorpus);
				};
				
				if ($scope.modelVal.A4 == $scope.property.perMonth)
					return;
				
				if (!$scope.property['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
			}
			
			$scope.calculateEstimates = function() {
				propertyService.getCorpusEstimates($scope.property['tenure'], $scope.modelVal.A5, $scope.modelVal.A6, $scope.modelVal.A7).then(function(data){
					if('success' in data){
						console.log("Success goal_estimation: " + data.success['goal_estimation']);
						var goalCorpusEstimates = data.success['goal_estimation'],
							goalEstimates = {};
						
						for (var i=0; i<goalCorpusEstimates.length; i++) {
							var computedSIPData = goalFormulaeService.computeSIPForCorpus({'corpus': goalCorpusEstimates[i].corpus, 'tenure': $scope.property['tenure'] }, $scope.property['assetAllocationCategory']);
							goalEstimates[goalCorpusEstimates[i].estimate_type] = {'corpus': goalCorpusEstimates[i].corpus,
																'sip' : computedSIPData.computedSIP,
																'assetAllocation' : computedSIPData.assetAllocation};
						}
						
						$scope.property['goalEstimates'] = goalEstimates;
						if (!$scope.activeTab) {
							$scope.activeTab = "COMFORT";
							$scope.estimateSelectionChanged(appConfig.estimateType.COMFORTABLE);
						}
					}
				});
			}
			
			$scope.estimateSelectionChanged = function(selectionType) {
				
				$scope.modelVal.A3 = $scope.property.goalEstimates[selectionType].corpus;
				$scope.modelVal.A4 = $scope.property.goalEstimates[selectionType].sip;
				$scope.property['corpus'] = $scope.property.goalEstimates[selectionType].corpus;
				$scope.property['perMonth'] = $scope.property.goalEstimates[selectionType].sip;
				$scope.property['assetAllocation'] = $scope.property.goalEstimates[selectionType].assetAllocation;
			}

			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		                               

})();