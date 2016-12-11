(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalsService', goalsService)
        .factory('assetAllocationService', assetAllocationService);

        goalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function goalsService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getGoalGraphDetails : getGoalGraphDetails
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
        }
        
        assetAllocationService.$inject = ['$resource','$q', 'appConfig', '$rootScope'];
        function assetAllocationService($resource, $q, appConfig, $rootScope){
        	
            return{
        		computeAssetAllocationCategory : computeAssetAllocationCategory,
        		computeAssetAllocation : computeAssetAllocation
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

	        function computeAssetAllocation(asset_allocation_category, sip, lumpsum){
	        	var assetAllocationTables = $rootScope.assetAllocationTables,
	        		assetAllocation = {"debt": 100, "equity" : 0},
	        		tableIndex = -1,
	        		minSIP = 0, minLumpsum = 0;

	        	if (typeof(asset_allocation_category) !== "undefined" && asset_allocation_category && assetAllocationTables.length > 0 && asset_allocation_category !== "OnlyDebt") { 
		        	if (asset_allocation_category === "OnlyEquity") {
		        		assetAllocation = {"debt": 0, "equity" : 100};
		        	}
		        	else {
			        	if (sip == 0 && lumpsum == 0) {
			        		tableIndex = assetAllocationTables.length - 1;
			        	}
			        	else {
				        	for(var i=0; i< assetAllocationTables.length; i++) {
				        		if (sip <= assetAllocationTables[i].sip_max && lumpsum <= assetAllocationTables[i].lumpsum_max) {
				        			tableIndex = i;
				        			break;
				        		}
				        	}
			        	}
			        	assetAllocation = assetAllocationTables[tableIndex]['table'][asset_allocation_category];
			        	
			        	if (tableIndex > 0) {
			        		minSIP = assetAllocationTables[tableIndex - 1].sip_max + 1;
			        		minLumpsum = assetAllocationTables[tableIndex - 1].lumpsum_max + 1;
			        	}
		        	}
	        	}
	        	return {"assetAllocation" : assetAllocation, "tableIndex" : tableIndex, "minSIP" : minSIP, "minLumpsum" : minLumpsum};
	        }
        }     

})();