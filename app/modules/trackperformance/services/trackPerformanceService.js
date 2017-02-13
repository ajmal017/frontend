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
                var xirr = response[year]['xirr'];
                var first_year = response[year]['dates'][0];
                var colors = ['#f23434','#1081c4','#f2692f','#999999','#B3B3B3','#F2F2F2'];
                var resultSet = [];
                for(var i=0;i<fundObject.length;i++){
                    var object = {};
                    var data = [];
                    var valueObject = fundObject[i]['value'];
                    var otherValueObj = fundObject[i]['other_value'];

                    if(dates.length > valueObject.length){
                        valueObject = fundObject[i]['value'];
                        otherValueObj = fundObject[i]['other_value'];
                        dates = response[year]['dates'].slice(0,valueObject.length);
                        xirr = response[year]['xirr'];
                        for(var j=0;j<valueObject.length;j++){
                            var value = +(valueObject[j].toFixed(2));
                            var other_value = +(otherValueObj[j].toFixed(2));

                            data.push({
                                'y' : value,
                                'y_other' : other_value,
                                'date':dates[j],
                                // 'x':dates[j],
                                'xirr':xirr[j],
                                'first_year':first_year
                            });
                        }
                    }else if(dates.length < valueObject.length){
                        dates = response[year]['dates'];
                        xirr = response[year]['xirr'];
                        valueObject = fundObject[i]['value'].slice(0,dates.length);
                        otherValueObj = fundObject[i]['other_value'];

                        for(var j=0;j<valueObject.length;j++){
                            var value = +(valueObject[j].toFixed(2));
                            var other_value = +(otherValueObj[j].toFixed(2));

                            data.push({
                                'y' : value,
                                'y_other' : other_value,
                                'date':dates[j],
                                // 'x':dates[j],
                                'xirr':xirr[j],
                                'first_year':first_year
                            });
                        }
                    }else if(dates.length == valueObject.length){
                        dates = response[year]['dates'];
                        xirr = response[year]['xirr'];
                        valueObject = fundObject[i]['value'];
                        otherValueObj = fundObject[i]['other_value'];

                        for(var j=0;j<valueObject.length;j++){
                            var value = +(valueObject[j].toFixed(2));
                            var other_value = +(otherValueObj[j].toFixed(2));
                           
                            data.push({
                                'y' : value,
                                'y_other' : other_value,
                                'date':dates[j],
                                // 'x':dates[j],
                                'xirr':xirr[j],
                                'first_year':first_year
                            });
                        }
                    }
                    data.first_year = first_year;
                    object['color'] = colors.splice(0,1).toString();
                    object['name'] = fundObject[i]['id'];
                    object['data'] = data;
                    object['marker'] = {symbol : 'square'};
                   
                    console.log('object pushed',object);
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
                                "value": resultSet.current_amount,
                                "other_value": resultSet.invested_amount
                                },
                                {
                                "id": "Invested Amount",
                                "value": resultSet.invested_amount,
                                "other_value": resultSet.current_amount
                                }
                        ],
                        
                        "dates": resultSet.date,
                        "category": [],
                        "xirr": resultSet.xirr
                    }
                }


                defer.resolve(obj);                
                return defer.promise;
                
            }
        }     
})();