(function(){
	'use strict';
	angular
		.module('finApp.registration',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/registration', {
				title : 'Registration',
		        templateUrl: 'modules/registration/views/register.html',
		        controller: 'registerController'
		    })
		    .when('/settings', {
				title : 'Settings',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registration/views/account_settings.html',
		        controller: 'registerController'
		    })
		}
})();