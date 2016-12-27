(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalsService', goalsService)
        .factory('assetAllocationService', assetAllocationService);

        goalsService.$inject = ['$resource','$rootScope','appConfig','$q', '$filter', 'goalFormulaeService'];
        function goalsService($resource,$rootScope,appConfig,$q, $filter, goalFormulaeService){
        	
            return{
        		getGoalGraphDetails : getGoalGraphDetails,
        		addParticularGoal : addParticularGoal,
        		initGoalGraphDetails : initGoalGraphDetails,
        		getFundSelection : getFundSelection,
        		deleteParticularGoal : deleteParticularGoal
        	}

	        function initGoalGraphDetails(){
                var category = [];
                var series = [{data:[]},{data:[],dashStyle:'ShortDash'}];
                var interval = 1;
                
                return {
                	category : category,
                	series : series,
                	interval : interval
                }
	        	
	        }


	        function deleteParticularGoal(goalType) {
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/answer/delete/' + goalType + '/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({},function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
	        }
	        
	        function getGoalGraphDetails(graphObject, assetAllocation, sipAmount, lumpsumAmount, tenure){ 
				var currentYear = new Date(),
					currentMonth = $filter('date')(currentYear, 'MMMM'),
					currentYear = currentYear.getFullYear();

				var category = graphObject.category,
					seriesProjected = graphObject.series[0],
					seriesInvested = graphObject.series[1];
				
                var investedValue = 0, expectedCorpus = 0;
                category.length = 0;
                category.push(String(currentYear));

                tenure = parseInt(tenure);
                sipAmount = parseInt(sipAmount); 
                lumpsumAmount = parseInt(lumpsumAmount);

                seriesProjected.data.length = 0;
                seriesInvested.data.length = 0;

                expectedCorpus = investedValue = lumpsumAmount + sipAmount;
        		var investedValueStr = $filter('amountSeffix')(investedValue);
        		var expectedCorpusStr = $filter('amountSeffix')(expectedCorpus);
                seriesProjected.data.push({y:expectedCorpus, invested:investedValueStr,projected:expectedCorpusStr});
            	seriesInvested.data.push({y:investedValue, invested:investedValueStr,projected:expectedCorpusStr});

                
                for (var i=1; i<=tenure; i++) {
                	var year = currentYear + i,
                		investedValue = lumpsumAmount + 12*i*sipAmount;
                		
                	var corpusResult = goalFormulaeService.computeCorpusForSIP({'sip': sipAmount, 'lumpsum' : lumpsumAmount, 'tenure': i}, null, assetAllocation),
                		expectedCorpus = corpusResult.computedCorpus;
                	
            		investedValueStr = $filter('amountSeffix')(investedValue),
            		expectedCorpusStr = $filter('amountSeffix')(expectedCorpus);
                	
                	category.push(String(year));
                	seriesProjected.data.push({y:expectedCorpus, invested:investedValueStr,projected:expectedCorpusStr});
                	seriesInvested.data.push({y:investedValue, invested:investedValueStr,projected:expectedCorpusStr});
                }
                var interval = parseInt(Math.ceil(parseFloat((category.length)/8))),
                	toDateStr = currentMonth + ' ' + String(currentYear + tenure);

                graphObject.interval = interval;
                graphObject.toDate = toDateStr;
                graphObject.totalInvestment = investedValue;
                graphObject.totalProjectedCorpus = expectedCorpus;
                
	        }

	        function getFundSelection(goalType) {
	        	var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/portfolio/goal/' + goalType + '/recommended/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({},function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
	        }

            function addParticularGoal(dataObj,goalType){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/' + goalType + '/new/response/add/', 
                    {}, {
                        Check: {
                            method:'POST',
                        }
                    });
                getAPI.Check(dataObj,function(data){
                    if(data.status_code == 200){
                        defer.resolve({'success':data.response});
                    }else{
                        defer.resolve({'Message':data.response['message']});
                    }               
                }, function(err){
                    defer.reject(err);
                }); 
                return defer.promise;
            }
        }
        assetAllocationService.$inject = ['$resource','$q', 'appConfig', '$rootScope'];
        function assetAllocationService($resource, $q, appConfig, $rootScope){
        	
            return{
        		computeAssetAllocationCategory : computeAssetAllocationCategory,
        		computeAssetAllocation : computeAssetAllocation,
        		getPossibleAssetAllocations : getPossibleAssetAllocations 
        	}

	        function computeAssetAllocationCategory(tenure){
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/core/assetallocation/category/compute/', 
					{}, {
						Check: {
							method:'GET',
						}
					});
				getAPI.Check({"tenure":tenure},function(data){
					if(data.status_code == 200){
						defer.resolve({'success':data.response});
					}else{
						defer.resolve({'Message':data.response['message']});
					}				
				}, function(err){
					defer.reject(err);
				}); 
				return defer.promise;
	        }

	        function computeAssetAllocation(assetAllocationCategory, sip, lumpsum){
	        	var assetAllocationTables = $rootScope.assetAllocationTables,
	        		assetAllocation = {"debt": 100, "equity" : 0},
	        		tableIndex = -1,
	        		minSIP = 0, minLumpsum = 0;

	        	if (typeof(assetAllocationCategory) !== "undefined" && assetAllocationCategory && assetAllocationTables.length > 0 && assetAllocationCategory !== appConfig.assetAllocationCategory.OnlyDebt) { 
		        	if (assetAllocationCategory === appConfig.assetAllocationCategory.OnlyEquity) {
		        		assetAllocation = {"debt": 0, "equity" : 100};
		        	}
		        	else {
		        		tableIndex = assetAllocationTables.length - 1;
		        		if (sip != 0 || lumpsum != 0) {
				        	for(var i=0; i< assetAllocationTables.length; i++) {
				        		if (sip <= assetAllocationTables[i].sip_max && lumpsum <= assetAllocationTables[i].lumpsum_max) {
				        			tableIndex = i;
				        			break;
				        		}
				        	}
			        	}
			        	
			        	assetAllocation = assetAllocationTables[tableIndex]['table'][assetAllocationCategory];
			        	
			        	if (tableIndex > 0) {
			        		minSIP = assetAllocationTables[tableIndex - 1].sip_max + 1;
			        		minLumpsum = assetAllocationTables[tableIndex - 1].lumpsum_max + 1;
			        	}
		        	}
	        	}
	        	assetAllocation.elss = 0;
	        	assetAllocation.liquid = 0;
	        	return {"assetAllocation" : assetAllocation, "tableIndex" : tableIndex, "minSIP" : minSIP, "minLumpsum" : minLumpsum};
	        }
	        
	        function getPossibleAssetAllocations(assetAllocationCategory, sip, lumpsum) {
	        	var assetAllocationTables = $rootScope.assetAllocationTables,
	        	possibleAssetAllocations = [],
	        	assetAllocation,
        		minSIP = 0, minLumpsum = 0;

	        	if (typeof(assetAllocationCategory) !== "undefined" && assetAllocationCategory && assetAllocationTables.length > 0 ) { 
	        		if (assetAllocationCategory === appConfig.assetAllocationCategory.OnlyDebt) {
	        			assetAllocation = {"debt": 100, "equity" : 0, "elss" : 0, "liquid" : 0};
	        			possibleAssetAllocations.push({"assetAllocation" : assetAllocation, "tableIndex" : -1, "minSIP" : minSIP, "minLumpsum" : minLumpsum});
	        		}
	        		else if (assetAllocationCategory === appConfig.assetAllocationCategory.OnlyEquity) {
		        		assetAllocation = {"debt": 0, "equity" : 100, "elss" : 0, "liquid" : 0};
		        		possibleAssetAllocations.push({"assetAllocation" : assetAllocation, "tableIndex" : -1, "minSIP" : minSIP, "minLumpsum" : minLumpsum});
		        	}
		        	else {
		        		console.log("in possible allocations: " + assetAllocationTables.length);
			        	for(var i=0; i< assetAllocationTables.length; i++) {
			        		if ((sip == 0 || sip <= assetAllocationTables[i].sip_max) && (lumpsum == 0 || lumpsum <= assetAllocationTables[i].lumpsum_max)) {
					        	if (i > 0) {
					        		minSIP = assetAllocationTables[i - 1].sip_max + 1;
					        		minLumpsum = assetAllocationTables[i - 1].lumpsum_max + 1;
					        	}

					        	assetAllocation = assetAllocationTables[i]['table'][assetAllocationCategory];
					        	assetAllocation.elss = 0;
					        	assetAllocation.liquid = 0;

			        			possibleAssetAllocations.push({"assetAllocation" : assetAllocation, "tableIndex" : i, "minSIP" : minSIP, "minLumpsum" : minLumpsum});
			        		}
			        	}
		        	}
		        }
		        return possibleAssetAllocations;
	        	
	        }

	}    

})();