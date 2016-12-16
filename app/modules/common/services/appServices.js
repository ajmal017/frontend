/*
Copyright Â© 2016, FinAskUs
Written under contract by Robosoft Technologies Pvt. Ltd.
*/
(function() {
    'use strict';
    angular
        .module('finApp.services', [])
        .factory('checkPath', checkPath)
        .factory('busyIndicator',busyIndicator)
        .factory('userDetailsService', userDetailsService)
        .factory('riskProfileService', riskProfileService)
        .factory('fileUpload',fileUpload)
        .factory('finWebInterCepter',finWebInterCepter);

        function checkPath() {
            return function(locationPath, pages) {
                return ($.inArray("/" + locationPath.split("/")[1], pages) > -1);
            }
        }

        busyIndicator.$inject = ['$rootScope'];
	    function busyIndicator($rootScope) {
	        return {
	            show: show,
	            hide: hide
	        }
	        function show() {
	            $rootScope.showLoader = true;
	            $('body').addClass('disable-scroll');
	        }
	        function hide() {
	            $rootScope.showLoader = false;
	            $('body').removeClass('disable-scroll');
	        }
	    }
        userDetailsService.$inject = ['$resource','$q','appConfig'];
        function userDetailsService($resource,$q,appConfig){
        	return function(){
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/user/profile/completeness/', 
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

        riskProfileService.$inject = ['$rootScope','appConfig'];
        function riskProfileService($rootScope, appConfig){
        	return function(){
        		var risk_score = 7.0,
        			riskProfile;
        		if ($rootScope.userFlags && $rootScope.userFlags['risk_score']) {
        			risk_score = $rootScope.userFlags['risk_score'];
        		}

        		if (risk_score <= 4) {
        			riskProfile = appConfig.riskProfile.low;
        		}
        		else if (risk_score <= 6) {
        			riskProfile = appConfig.riskProfile.belowAverage;
        		}
        		else if (risk_score <= 7.5) {
        			riskProfile = appConfig.riskProfile.average;
        		}
        		else if (risk_score <= 8.5) {
        			riskProfile = appConfig.riskProfile.aboveAverage;
        		}
        		else {
        			riskProfile = appConfig.riskProfile.high;
        		}
        		
        		return riskProfile;
        	}
        }
        
        function fileUpload(params){
        	return function(){
        		var defer = $q.defer();
				var getAPI = $resource( 
					appConfig.API_BASE_URL+'/fileUpload', 
					{}, {
						Check: {
							method:'POST',
							transformRequest:function(data){
								var fd = new FormData();
								angular.forEach(data, function(value, key) {
									fd.append(key, value);
								});
								return fd;
							}
						}
					});
				getAPI.Check(params,function(data){
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

	    finWebInterCepter.$inject = ['$q', '$location', '$timeout', '$rootScope', 'appText', 'appConfig'];

	    function finWebInterCepter($q, $location, $timeout, $rootScope, appText, appConfig) {
	        var authFactory = {};
	        var URL;
	        var promise = [];
	        var promiseExit = [];
	        var intercept = ["html", "less", "js", "css"];
	        var hideLoading = [];

	        var _request = function(config) {
	            var userID = "";
	            var SessionToken = "";
	            config.headers = config.headers || {};
	            config.data = config.data || {};
	            config.params = config.params || {};
	            URL = config.url.replace(appConfig.API_BASE_URL,'');
	            
	            $rootScope.userDetails = JSON.parse(sessionStorage.getItem('userDetails')) || {};
	            if (!!$rootScope.userDetails.user) {
	                SessionToken = ($rootScope.userDetails.user != 'undefined') ? JSON.parse(sessionStorage.getItem('tokens')) : "";
	            }
	            if ($.inArray(config.url.split('.').pop().split("?")[0].toLowerCase(), intercept) === -1) {
	                config.timeout = 600000;
	                if ($.inArray(URL, hideLoading) === -1) {
	                    (URL in promise) ? $timeout.cancel(promise[URL]): "";
	                    (URL in promiseExit) ? $timeout.cancel(promiseExit[URL]): "";
	                    promiseExit[URL] = $timeout(function() { // show timeout message after 120 s
	                        // combLoader.hideLoader();
	                        // comModalAlert.showAlert(appText.info.loading_timeout_exit);
	                        // if ($rootScope.showLoader.$$phase) $rootScope.$apply();
	                    }, 600000);
	                }
	                console.log("\r\n\r\n******************** BEGIN REQUEST ***************************\r\n");
	              if (URL.indexOf(appConfig.noTokenAPI) == -1 && !!$rootScope.userDetails.user) {
	              		console.log(">>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(SessionToken));
	                    (SessionToken) ? (config.headers['Authorization'] = SessionToken['tokens']['token_type']+' '+SessionToken['tokens']['access_token']) : "";
	                    console.log("Time: " + Date() + "\r\n");
	                    console.log("Request: " + JSON.stringify(config.url) + "\r\n");
	                    console.log("Params: " + JSON.stringify(config) + "\r\n");
	                    console.log("******************** END REQUEST *****************************\r\n" + config.data.UserID);
	                }
	                else {
		                console.log("Time: " + Date() + "\r\n");
	                    console.log("Request: " + JSON.stringify(config.url) + "\r\n");
	                    console.log("Payload: " + JSON.stringify(config.data) + "\r\n");
	                    console.log("******************** END REQUEST *****************************\r\n" + config.data.UserID);
	                }
	            }
	            return config || $q.when(config);
	        }

	        var _requestError = function(rejection) {
	            URL = rejection.url.split('/').pop().split("?")[0].toLowerCase();
	            if ($.inArray(rejection.url.split('.').pop().split("?")[0].toLowerCase(), intercept) === -1) {
	                console.log("\r\n\r\n******************** BEGIN REQUEST ***************************\r\n");
	                console.log("Time: " + Date() + "\r\n");
	                console.log("Request: " + JSON.stringify(rejection.url) + "\r\n");
	                console.log("Request[ERROR]: " + JSON.stringify(rejection) + "\r\n");
	                console.log("******************** END REQUEST *****************************\r\n");

	                (URL in promise) ? $timeout.cancel(promise[URL]): "";
	                (URL in promiseExit) ? $timeout.cancel(promiseExit[URL]): "";

	            }
	            return $q.reject(rejection);
	        }

	        var _response = function(response) {
	            URL = response.config.url.split('/').pop().split("?")[0].toLowerCase();
	            if ($.inArray(response.config.url.split('.').pop().split("?")[0].toLowerCase(), intercept) === -1) {
	                (URL in promise) ? $timeout.cancel(promise[URL]): "";
	                (URL in promiseExit) ? $timeout.cancel(promiseExit[URL]): "";
	                console.log("******************** BEGIN RESPONSE ***************************\r\n");
	                console.log("Response: " + JSON.stringify(response.data) + "\r\n");
	                console.log("******************** END RESPONSE *****************************\r\n");
	            }
	            return response || $q.when(response);
	        }

	        var _responseError = function(rejection) {
	            URL = rejection.config.url.split('/').pop().split("?")[0].toLowerCase();
	            if ($.inArray(rejection.config.url.split('.').pop().split("?")[0].toLowerCase(), intercept) === -1) {
	                console.log("******************** BEGIN RESPONSE ***************************\r\n");
	                console.log("Response[ERROR]: " + JSON.stringify(rejection) + "\r\n");
	                console.log("******************** END RESPONSE *****************************\r\n");
	                if(rejection.status == "401") {
	                	alert("Kindly login to continue");
	                	$location.path('/');
	                }
	                (URL in promise) ? $timeout.cancel(promise[URL]): "";
	                (URL in promiseExit) ? $timeout.cancel(promiseExit[URL]): "";
	            }
	            return $q.reject(rejection);
	        }

	        authFactory.request = _request;
	        authFactory.requestError = _requestError;
	        authFactory.response = _response;
	        authFactory.responseError = _responseError;
	        return authFactory;
	    }
})();