(function() {
    'use strict';
    angular
        .module('finApp.riskAssesment')
        .factory('riskService', riskService);

        riskService.$inject = ['$resource','appConfig','$q'];
        function riskService($resource,appConfig,$q){

        	var assesObject = {};
        	
        	return{
        		setAssesmentObject : setAssesmentObject,
        		getAssesmentObject : getAssesmentObject,
        		getAssesmentResult : getAssesmentResult
        	}
        	
        	function setAssesmentObject(param){
        		assesObject = angular.extend(assesObject, param);
        		//alert(JSON.stringify(assesObject));
        	}

        	function getAssesmentObject(){
        		return assesObject;
        	}

	        function getAssesmentResult(params){

					var defer = $q.defer();
					var postAPI = $resource( 
						appConfig.API_BASE_URL+'/core/assess/new/response/', 
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