(function(){
	'use strict';
	angular
		.module('finApp.auth',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/gettingStarted', {
		        templateUrl: 'modules/authentication/views/getstarted.html',
		        controller: 'authController'
		    })
		}
})();