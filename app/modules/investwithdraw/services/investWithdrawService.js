(function() {
    'use strict';
    angular
        .module('finApp.investWithdraw')
        .factory('investWithdrawService', investWithdrawService);

        investWithdrawService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function investWithdrawService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getPlanDetails : getPlanDetails,
                getInvestDetails : getInvestDetails,
                getWithdrawDetails : getWithdrawDetails,
                postWithdrawDetails : postWithdrawDetails
        	}

	        function getPlanDetails(){               
	        }

            function getInvestDetails() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/review/cart/', 
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

            function getWithdrawDetails() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/invested/fund/get/', 
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

            function postWithdrawDetails(resultObj) {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/goal/redeem/add/new/', 
                    {}, {
                        Check: {
                            method:'POST',
                        }
                    });
                getAPI.Check(resultObj,function(data){
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
})();