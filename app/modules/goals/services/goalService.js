(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalsService', goalsService)
        .factory('assetAllocationService', assetAllocationService);

        goalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function goalsService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getGoalGraphDetails : getGoalGraphDetails,
        		getFundSelection : getFundSelection,
        		addParticularGoal : addParticularGoal
        	}

	        function getGoalGraphDetails(){ 
                var catergory = ['2016', '2017', '2018', '2019', '2020','2021', '2022'];
                var series = [{data:[{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'},{y:0.5,invested:'14lakh',projected:'50lakh'},{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'}]},{data:[{y:0.2,invested:'14lakh',projected:'50lakh'},{y:0.5,invested:'14lakh',projected:'50lakh'},{y:1,invested:'14lakh',projected:'50lakh'},{y:2,invested:'14lakh',projected:'50lakh'},{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'}],dashStyle:'ShortDash'}];
                var title = '54.4 lakh';
                var interval = parseInt((catergory.length)/8);
                return {
                    catergory : catergory,
                    series : series,
                    title : title,
                    interval : interval
                }            
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
	        	return {"assetAllocation" : assetAllocation, "tableIndex" : tableIndex, "minSIP" : minSIP, "minLumpsum" : minLumpsum};
	        }
	        
	        function getPossibleAssetAllocations(assetAllocationCategory, sip, lumpsum) {
	        	var assetAllocationTables = $rootScope.assetAllocationTables,
	        	possibleAssetAllocations = [],
	        	assetAllocation,
        		minSIP = 0, minLumpsum = 0;

	        	if (typeof(assetAllocationCategory) !== "undefined" && assetAllocationCategory && assetAllocationTables.length > 0 ) { 
	        		if (assetAllocationCategory === appConfig.assetAllocationCategory.OnlyDebt) {
	        			assetAllocation = {"debt": 100, "equity" : 0};
	        			possibleAssetAllocations.push({"assetAllocation" : assetAllocation, "tableIndex" : -1, "minSIP" : minSIP, "minLumpsum" : minLumpsum});
	        		}
	        		else if (assetAllocationCategory === appConfig.assetAllocationCategory.OnlyEquity) {
		        		assetAllocation = {"debt": 0, "equity" : 100};
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
			        			possibleAssetAllocations.push({"assetAllocation" : assetAllocation, "tableIndex" : i, "minSIP" : minSIP, "minLumpsum" : minLumpsum});
			        		}
			        	}
		        	}
		        }
		        return possibleAssetAllocations;
	        	
	        }
        }     

})();