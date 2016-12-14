(function() {
    'use strict';
    angular
        .module('finApp.smartPortFolio')
        .factory('recommendedService', recommendedService);

        recommendedService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function recommendedService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getGraphResultSet : getGraphResultSet,
                resetCompareScheme : resetCompareScheme,
                getFundsForGoal : getFundsForGoal,
                saveCompareModifyScheme : saveCompareModifyScheme,
                validateCompareModifyScheme : validateCompareModifyScheme
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
                var indexObject = {};
                indexObject['color'] = colors.splice(0,1).toString();
                indexObject['name'] = 'BSE SENSEX';
                indexObject['marker'] = {symbol : 'square'}
                var dataIndex = [];
                for(var k=0;k<valueObject.length;k++){
                    dataIndex.push({
                        'y' : response[year]['index'][k],
                        'date':dates[k]
                    });
                }
                indexObject['data'] = dataIndex;
                resultSet.push(indexObject);
                
                defer.resolve(resultSet);                
                return defer.promise;
	        }

            function resetCompareScheme(goalType, assetType){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/reset/goal/' + goalType + '/?reset=' + assetType, 
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

            function getFundsForGoal(goalType){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/funds/goal/'+ goalType +'/get/all/', 
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

            function validateCompareModifyScheme(dataObj){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/funds/distribution/goal/retirement/validate/', 
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

            function saveCompareModifyScheme(dataObj){
                var defer = $q.defer();
                var getAPI = $resource( 
                    appConfig.API_BASE_URL+'/core/portfolio/goal/retirement/change/', 
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
})();