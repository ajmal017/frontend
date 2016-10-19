(function(){
	'use strict';
	angular
		.module('finApp.auth')
		.controller('authController',authController);

		function authController(){
			console.log("loaded----");
		}
})();