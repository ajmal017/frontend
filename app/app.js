/*
Copyright Â© 2016, FinAskUs
Written under contract by Robosoft Technologies Pvt. Ltd.
*/
(function(){
	'use strict';
	angular.module('finApp',[
		'ngRoute',
		'ngResource',
		'ngSanitize',
		'finApp.directives',
		'finApp.auth'
	])
	.config(config)
	.run(run);

	config.$inject = ['$routeProvider','$httpProvider'];
	function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/', {
                templateUrl: 'modules/authentication/views/login.html',
                controller: 'authController'
            })
            .otherwise({
                redirectTo: '/404',
                title : 'Page not found',
                templateUrl: 'modules/common/views/404.html'
            });
		//$httpProvider.interceptors.push('finAppHttpIntercepter');
	}
	run.$inject = ['$route','$routeParams','$rootScope'];
	function run($route,$routeParams,$rootScope){
		
		
		$rootScope.$on('$locationChangeStart', function(event, current, previous) {
		
		});
		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			$rootScope.title = $route.current.title;

		});
		
		$rootScope.userLogout = function(){

		}

		$rootScope.$on('userloggedIn', function(event, data) {

		});
        $rootScope.$on('userloggedOut', function(event, args) {
     
        });

		document.addEventListener("online", function() { 
			$rootScope.online = true;  
		}, false);

		document.addEventListener("offline", function() { 
			$rootScope.online = false;   
		}, false);

		$rootScope.$watch('online', function(newStatus) {
            if (newStatus == false) {
            }
        });
	}
})();