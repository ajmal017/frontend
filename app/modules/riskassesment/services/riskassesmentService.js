(function() {
    'use strict';
    angular
        .module('finApp.riskAssesment')
        .factory('riskService', riskService);

        riskService.$inject = ['$rootScope','$resource','appConfig','$q'];
        function riskService($rootScope,$resource,appConfig,$q){

        	var assesObject = {};
        	
        	return{
        		setAssesmentObject : setAssesmentObject,
        		getAssesmentObject : getAssesmentObject,
        		getAssesmentResult : getAssesmentResult
        	}
        	
        	function setAssesmentObject(param){
        		assesObject = angular.copy(param);
        		//alert(JSON.stringify(assesObject));
        	}

        	function getAssesmentObject(){
                
                console.log('userFlags',jQuery.isEmptyObject($rootScope.userFlags));

                if(!jQuery.isEmptyObject($rootScope.userFlags)){
                    assesObject = $rootScope.userFlags['user_answers']['assess'];
                }
                
        		return assesObject;

        	}

	        function getAssesmentResult(params){
					var defer = $q.defer();
                    console.log('$rootScope.loggedIn',$rootScope.loggedIn);
                    console.log('$rootScope.action',$rootScope.action);
                    var url = ($rootScope.loggedIn && $rootScope.action != 'onlyLogin')?'/core/assess/new/response/add/':
                        '/core/assess/new/response/';
					var postAPI = $resource( 
						appConfig.API_BASE_URL+url, 
						{}, {
							Check: {
								method:'POST',
							}
						});
					postAPI.Check(params,function(data){
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