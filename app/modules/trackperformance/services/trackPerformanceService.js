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
                getTransactionHistory : getTransactionHistory,
                getGraphData : getGraphData,
                getGraphResultSet : getGraphResultSet
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

            function getGraphResultSet(response,year){
                var defer = $q.defer();

                var fundObject = response[year]['fund'];
                var dates = response[year]['dates'];
                var colors = ['#f23434','#1081c4','#f2692f','#999999','#B3B3B3','#F2F2F2'];
                var resultSet = [];
                for(var i=0;i<fundObject.length;i++){
                    var object = {};
                    var data = [];
                    var valueObject = fundObject[i]['value'];
                    if(dates.length > valueObject.length){
                        valueObject = fundObject[i]['value'];
                        dates = response[year]['dates'].slice(0,valueObject.length)
                        for(var j=0;j<valueObject.length;j++){
                            data.push({
                                'y' : valueObject[j],
                                'date':dates[j]
                            });
                        }
                    }else if(dates.length < valueObject.length){
                        dates = response[year]['dates']
                        valueObject = fundObject[i]['value'].slice(0,dates.length);
                        for(var j=0;j<valueObject.length;j++){
                            data.push({
                                'y' : valueObject[j],
                                'date':dates[j]
                            });
                        }
                    }else if(dates.length == valueObject.length){
                        dates = response[year]['dates']
                        valueObject = fundObject[i]['value'];
                        for(var j=0;j<valueObject.length;j++){
                            data.push({
                                'y' : valueObject[j],
                                'date':dates[j]
                            });
                        }
                    }
                    object['color'] = colors.splice(0,1).toString();
                    object['name'] = fundObject[i]['id'];
                    object['data'] = data;
                    object['marker'] = {symbol : 'square'};
                    resultSet.push(object);
                }
                
                defer.resolve(resultSet);                
                return defer.promise;
            }

            function getGraphData(resultSet) {
                var defer = $q.defer();
                console.log('resultSet',resultSet);

                var obj = {
                    "three_year": {
                        "fund": [{
                                "id": "Current Amount",
                                "value": resultSet.current_amount
                                },
                                {
                                "id": "Invested Amount",
                                "value": resultSet.invested_amount
                                }
                        ],
                        
                        "dates": resultSet.date,
                        "category": []
                    }
                }


                defer.resolve(obj);                
                return defer.promise;
                
            }
        }     
})();