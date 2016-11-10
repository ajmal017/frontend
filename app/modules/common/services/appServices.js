/*
Copyright Â© 2016, FinAskUs
Written under contract by Robosoft Technologies Pvt. Ltd.
*/
(function() {
    'use strict';
    angular
        .module('finApp.servies', [])
        .factory('checkPath', checkPath)
        .factory('finWebInterCepter',finWebInterCepter);

        function checkPath() {
            return function(locationPath, pages) {
                return ($.inArray("/" + locationPath.split("/")[1], pages) > -1);
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
	        var noTokenUrl = [];
	        var _request = function(config) {
	            var userID = "";
	            var SessionToken = "";
	            config.headers = config.headers || {};
	            config.data = config.data || {};
	            config.params = config.params || {};
	            URL = config.url.split('/').pop().split("?")[0].toLowerCase();
	            //$rootScope.globals = JSON.parse(localStorage.getItem('userCredentials')) || {};
	            // if (!!$rootScope.globals.user) {
	            //     userID = ($rootScope.globals.user != 'undefined') ? $rootScope.globals.user.userID : "";
	            //     SessionToken = ($rootScope.globals.user != 'undefined') ? $rootScope.globals.user.sessionToken : "";
	            // }

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
	              if (URL.indexOf(noTokenUrl) == -1 && !!$rootScope.globals.user) {
	                   
	                    (userID) ? (config.data.UserID = userID) : "";
	                    (SessionToken) ? (config.data.Token = SessionToken) : "";
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