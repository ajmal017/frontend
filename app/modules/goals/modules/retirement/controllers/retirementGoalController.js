(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('retirementGoalsController',retirementGoalsController);

		retirementGoalsController.$inject = ['$scope','$rootScope','$route','$location',
		                                     'goalsService','retirementGoalsService', 'assetAllocationService', 'goalFormulaeService']
		function retirementGoalsController($scope,$rootScope,$route,$location,goalsService,retirementGoalsService, 
											assetAllocationService, goalFormulaeService) {
			$scope.retirement = {};
			$scope.modelVal = retirementGoalsService.getSavedValues();
			$scope.showEquityModal = function(){
				$('#equiDeptModal').modal('show');
			}
			$scope.reloadRoute = function(param) {
				$rootScope.selectedCriteria = param;
				if(!$rootScope.$$phase) $rootScope.$apply();
				$rootScope.slideTobeChanged = 2;
			    $route.reload();
			}
			$scope.sendValues = function(value){
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
						$scope.retirement['assetAllocationCategory'] = data.success['asset_allocation_category'];
					}
					else {
						$scope.retirement['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					$scope.broadcast('assetAllocationCategoryChanged');
					if(!$scope.$$phase)	$scope.$apply();
				});

			}
			$scope.calculateRecommendedSIP = function(corpus) {
				var calculateSIP - function() {
					$scope.retirement['perMonth'] = goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': $scope.retirement['tenure'] }, $scope.retirement['assetAllocationCategory']);
					if(!$scope.$$phase)	$scope.$apply();
				};
				
				if (!$scope.retirement['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
			}

			$scope.calculateCorpus = function(sipAmount) {
				var calculateCorpus - function() {
					goalFormulaeService.computeSIPForCorpus({'sip': sipAmount, 'tenure': $scope.retirement['tenure'] }, $scope.retirement['assetAllocationCategory']);
					if(!$scope.$$phase)	$scope.$apply();
				};
				
				if (!$scope.retirement['assetAllocationCategory']) {
					$scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
			}

			$scope.graphObject = goalsService.getGoalGraphDetails();
		}

})();