(function() {
    'use strict';
    angular
        .module('finApp.trackPerformance')
        .factory('trackPerformanceService', trackPerformanceService);

        trackPerformanceService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function trackPerformanceService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getHexcolors : getHexcolors,
                getPortfolioDetails : getPortfolioDetails,
                getDashboardDetails : getDashboardDetails,
                getPortfolioTracker : getPortfolioTracker,
                getLeaderBoard : getLeaderBoard,
                getTransactionHistory : getTransactionHistory
        	}

	        function getHexcolors(hex, lum){     
                hex = String(hex).replace(/[^0-9a-f]/gi, '');
                if (hex.length < 6) {
                    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
                }
                lum = lum || 0;
                var rgb = "#", c, i;
                for (i = 0; i < 3; i++) {
                    c = parseInt(hex.substr(i*2,2), 16);
                    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                    rgb += ("00"+c).substr(c.length);
                }
                return rgb;          
	        }

            function getPortfolioDetails() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/portfolio/details/v2/', 
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

            function getDashboardDetails() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/dashboard/v2/', 
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

            function getPortfolioTracker() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/portfolio/tracker/', 
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

            function getLeaderBoard() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/leader/board/', 
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

            function getTransactionHistory() {
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/transaction/history/', 
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
        }     
})();