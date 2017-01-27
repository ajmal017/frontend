var finApp = finApp || {};
(function(){
	'use strict';

	finApp.goalControllerPrototype = {
			showEquityModal: function(minAmount){
				if (typeof(minAmount) === "undefined" || minAmount == undefined) {
					minAmount = 1000;
				}
				
				this.scope.minAmount = minAmount;
				$('#equiDeptModal').modal('show');
			},
			
			reloadRoute : function(param, slideNumber) {
				this.rootScope.selectedCriteria = param;
				if(!this.rootScope.$$phase) this.rootScope.$apply();
				if (typeof(slideNumber) === "undefined")
					slideNumber = 2;
				
				this.rootScope.slideTobeChanged = slideNumber;
			    this.route.reload();
			},
			
			appendValues : function(value){
				value.goal_plan_type = this.rootScope.selectedCriteria;
				console.log('value',value);
				this.goalTypeService.setSavedValues(value);
			},
			
			portfolioFactoring : function() {
				var self = this;
				this.rootScope.showPortfolioFactoring = false;
				
				this.timeout(function() {
					self.location.path('/dashboard');

					self.scope.$apply();
				},5000)
			},

			getAssetAllocationCategory : function(){
				var currentYear = new Date(),
					tenure = this.scope.modelVal.A2 - currentYear.getFullYear(),
					self = this;
				
				this.goalModelObject['tenure'] = tenure;
				
				this.assetAllocationService.computeAssetAllocationCategory(tenure).then(function(data){
					if('success' in data){
						console.log("Success asset category: " + data.success['asset_allocation_category']);
						self.goalModelObject['assetAllocationCategory'] = data.success['asset_allocation_category'];
					}
					else {
						self.goalModelObject['assetAllocationCategory'] = "A"; //TODO define constants, default category
					}
					self.scope.$broadcast('assetAllocationCategoryChanged');
				});

			},
			
			calculateRecommendedSIP : function(corpus) {
				var self = this;
				
				var calculateSIP = function() {
					var computedSIPData = self.goalFormulaeService.computeSIPForCorpus({'corpus': corpus, 'tenure': self.goalModelObject['tenure'] }, self.goalModelObject['assetAllocationCategory']);
					var assetAllocation = {};
					if(self.scope.modelVal.sip && (parseInt(computedSIPData.computedSIP) == parseInt(self.scope.modelVal.sip))) {
						assetAllocation = self.scope.modelVal.assetAllocation;
					} else {
						assetAllocation = computedSIPData.assetAllocation;
					}
					assetAllocation.equityInitial = computedSIPData.assetAllocation.equity;
					self.goalModelObject['perMonth'] = computedSIPData.computedSIP;
					self.goalModelObject['assetAllocation'] = computedSIPData.assetAllocation;
					self.scope.modelVal.A4 = self.scope.modelVal.A4 || self.goalModelObject['perMonth']; 
					self.goalModelObject['corpus'] = corpus;
					self.setModelVal(assetAllocation, computedSIPData.computedSIP);
				};
				
				if (!this.goalModelObject['assetAllocationCategory']) {
					this.scope.$on('assetAllocationCategoryChanged', calculateSIP);
				}
				else {
					calculateSIP();
				}
			},
			
			calculateCorpus : function(sipAmount) {
				var self  = this;
				
				var calculateCorpus = function() {
					var computedSIPData = self.goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'tenure': self.goalModelObject['tenure'] }, self.goalModelObject['assetAllocationCategory']);
					self.goalModelObject['corpus'] = computedSIPData.computedCorpus;
					self.goalModelObject['assetAllocation'] = computedSIPData.assetAllocation;
					console.log("calculateCorpus: " + JSON.stringify(computedSIPData.assetAllocation) + " corpus: " + computedSIPData.computedCorpus);
					self.setModelVal(computedSIPData.assetAllocation, sipAmount);
				};
				
				//if (this.scope.modelVal.A4 == this.goalModelObject.perMonth)
					//return;
				
				if (!this.goalModelObject['assetAllocationCategory']) {
					this.scope.$on('assetAllocationCategoryChanged', calculateCorpus);
				}
				else {
					calculateCorpus();
				}
			},
			
			handleGoalEstimatesResponse : function(data) {
				var self = this;
				if('success' in data){
					console.log("Success goal_estimation: " + data.success['goal_estimation']);
					var goalCorpusEstimates = data.success['goal_estimation'],
						goalEstimates = {};
					
					for (var i=0; i<goalCorpusEstimates.length; i++) {
						var computedSIPData = self.goalFormulaeService.computeSIPForCorpus({'corpus': goalCorpusEstimates[i].corpus, 'tenure': self.goalModelObject['tenure'] }, self.goalModelObject['assetAllocationCategory']);
						goalEstimates[goalCorpusEstimates[i].estimate_type] = {'corpus': goalCorpusEstimates[i].corpus,
															'sip' : computedSIPData.computedSIP,
															'assetAllocation' : computedSIPData.assetAllocation};
					}
					//self.setModelVal(computedSIPData.assetAllocation, computedSIPData.computedSIP);
					self.goalModelObject['goalEstimates'] = goalEstimates;
					if (!self.scope.modelVal.estimate_selection_type) {
						self.scope.modelVal.estimate_selection_type = 'op2';
					}
					self.scope.estimateSelectionChanged(self.appConfig.estimateType.COMFORTABLE);
				}
				
			},
			
			estimateSelectionChanged : function(selectionType) {
				this.scope.modelVal.A3 = this.goalModelObject.goalEstimates[selectionType].corpus;
				this.scope.modelVal.A4 = this.goalModelObject.goalEstimates[selectionType].sip;
				this.goalModelObject['corpus'] = this.goalModelObject.goalEstimates[selectionType].corpus;
				this.goalModelObject['perMonth'] = this.goalModelObject.goalEstimates[selectionType].sip;
				if(this.scope.modelVal.sip == this.goalModelObject.goalEstimates[selectionType].sip){
					this.goalModelObject['assetAllocation'] = this.scope.modelVal.assetAllocation;
				} else {
					this.goalModelObject['assetAllocation'] = this.goalModelObject.goalEstimates[selectionType].assetAllocation;
				}
				this.goalModelObject['assetAllocation']['equityInitial'] = this.goalModelObject.goalEstimates[selectionType].assetAllocation['equity'];
				// if(this.scope.modelVal.sip && (parseInt(this.goalModelObject.goalEstimates[selectionType].sip) == parseInt(this.scope.modelVal.sip))) {
				// 	this.goalModelObject['assetAllocation'] = this.scope.modelVal.assetAllocation;
				// } else {

				// }
							
				this.setModelVal(this.goalModelObject['assetAllocation'], this.goalModelObject['perMonth']);
			},

			callModel : function(debtValue, equityValue, amount, minAmount) {
				console.log('debtValue',debtValue,'equityValue',equityValue,'amount',amount);
				if (typeof(minAmount) === "undefined" || minAmount == undefined) {
					minAmount = 1000;
				}

				this.scope.minAmount = minAmount;
				
				this.scope.amount = amount;

				this.scope.equity = debtValue;
				this.scope.equity2 = equityValue;
				
				var debtAmount = (this.scope.equity/100) * amount;
				var equityAmount = (this.scope.equity2/100) * amount;
				this.scope.debtAmountModal = debtAmount;
				this.scope.equityAmountModal = equityAmount;
				jQuery('#equiDeptModal').modal('show');
			},

			setModelVal : function(assetAllocationObj, sipAmount) {
				this.scope.sipAmount = sipAmount;
				this.scope.modelVal.assetAllocation = assetAllocationObj;
				var debtAmount = Math.round((assetAllocationObj.debt/100) * sipAmount);
				var equityAmount = Math.round((assetAllocationObj.equity/100) * sipAmount);
				this.scope.modelVal.debtAmount = debtAmount;
				this.scope.modelVal.equityAmount = equityAmount;
				this.scope.getGoalGraphDetails();
			},

			changeDebtModal : function() {
				
				this.scope.equity2 = 100 - this.scope.equity;
				this.scope.debtAmountModal = Math.round((this.scope.equity/100) * this.scope.amount);
				this.scope.equityAmountModal = Math.round((this.scope.equity2/100) * this.scope.amount);

			},

			changeEquityModal : function() {
				
				this.scope.equity = 100 - this.scope.equity2;
				this.scope.equityAmountModal = Math.round((this.scope.equity2/100) * this.scope.amount);
				this.scope.debtAmountModal = Math.round((this.scope.equity/100) * this.scope.amount);
			},

			saveEquityDebtMix : function() {
				console.log('Saved mix');
				this.scope.modelVal.assetAllocation.debt = this.scope.equity;
				this.scope.modelVal.assetAllocation.equity = this.scope.equity2;
				this.scope.modelVal.debtAmount = this.scope.debtAmountModal;
				this.scope.modelVal.equityAmount = this.scope.equityAmountModal;
				jQuery('#equiDeptModal').modal('hide');	
				this.getGoalGraphDetails();
			},

			resetAllocation : function(equityInitial) {
				this.scope.modelVal.assetAllocation.equity = equityInitial;
				this.scope.modelVal.assetAllocation.debt = 100 - equityInitial;
				this.scope.modelVal.debtAmount = (this.scope.modelVal.assetAllocation.debt/100) * this.scope.sipAmount;
				this.scope.modelVal.equityAmount = (this.scope.modelVal.assetAllocation.equity/100) * this.scope.sipAmount;
				this.getGoalGraphDetails();
				console.log('modelVal',this.scope.modelVal);
				// this.scope.modelVal = this.rootScope.modelValInitial;
			},

			getFundData : function(goal, busyIndicator) {
				var self = this;
				var indicate = self.busyIndicator;
				this.goalsService.getFundSelection(goal).then(function(data){
					
					if('success' in data){	
						self.rootScope.setFundData = data.success;
						
						self.location.path('/recommendedSchemes');
						busyIndicator.hide();
					} else {
						console.log(data.Message);
					}
				});
			},
			
			getGraphObject : function() {
				if (!this.scope.graphObject) {
					this.scope.graphObject = this.goalsService.initGoalGraphDetails();
				}
				return this.scope.graphObject;
			},
			
			getGoalGraphDetails : function() {
				this.goalsService.getGoalGraphDetails(this.scope.graphObject, this.scope.modelVal.assetAllocation, this.scope.modelVal.A4, 0, this.goalModelObject['tenure']);

				console.log('$scope.graphObject',this.scope.graphObject);
			}


			
	};
})();