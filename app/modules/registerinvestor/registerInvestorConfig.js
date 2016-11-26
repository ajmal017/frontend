(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/registerInvestor', {
				title : 'Investor Registration',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/registerInvestor.html',
		        controller: 'registerInvestorController'
		    })
		    .when('/registerInvestorStart', {
		    	title : 'Investor Registration',
		    	subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/registerInvestorStarted.html',
		        controller: 'registerInvestorController'
		    })
		    .when('/registerInvestorInfo', {
		    	title : 'Investor Registration',
		    	subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/registerInvestorInfo.html',
		        controller: 'registerInvestorController'
		    })
		    .when('/investorInfo', {
		    	title : 'Investor Registration',
		    	subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/investorInfo.html',
		    })
		    .when('/bankInfo', {
		    	title : 'Investor Registration',
		    	subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/bankInfo.html',
		    })
		    .when('/nomineeInfo', {
		    	title : 'Investor Registration',
		    	subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/registerinvestor/views/nomineeInfo.html',
		    })
		}
})();