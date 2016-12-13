(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.controller('propertyController',propertyController);

		propertyController.$inject = ['$scope','$rootScope','$route','$location','propertyService',
		                              'goalsService', 'assetAllocationService', 'goalFormulaeService', 'appConfig'];
		function propertyController($scope,$rootScope,$route,$location,propertyService,
				goalsService, assetAllocationService, goalFormulaeService, appConfig) {
			
			this.scope = $scope;

			this.scope.property = {};
			this.goalModelObject = this.scope.property;
			
			this.scope.modelVal = propertyService.getSavedValues();
			
			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location,
			this.goalsService = goalsService;
			this.assetAllocationService = assetAllocationService;
			this.goalFormulaeService = goalFormulaeService;
			this.appConfig = appConfig;
			this.goalTypeService = propertyService;
			
			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );
			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.appendValues = angular.bind( this, this.appendValues );
			this.scope.getAssetAllocationCategory = angular.bind( this, this.getAssetAllocationCategory );
			this.scope.calculateRecommendedSIP = angular.bind( this, this.calculateRecommendedSIP );
			this.scope.calculateCorpus = angular.bind( this, this.calculateCorpus);
			this.scope.estimateSelectionChanged = angular.bind( this, this.estimateSelectionChanged);

			
			this.scope.calculateEstimates = function() {
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
			
			$scope.graphObject = goalsService.getGoalGraphDetails();

		}
		                               
		propertyController.prototype = finApp.goalControllerPrototype;

})();