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
		}
})();