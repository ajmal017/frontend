(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('educationController',educationController);

		educationController.$inject = ['$scope','$rootScope','$route','$location',
	                                     'goalsService','educationService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		                               
		function educationController($scope,$rootScope, $route, $location,
				goalsService, educationService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.education = {};
			this.goalModelObject = this.scope.education;
			
			this.scope.modelVal = educationService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = educationService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);
			
			
			this.scope.calculateEstimates = function() {
				
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
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		
		educationController.prototype = finApp.goalControllerPrototype;
})();