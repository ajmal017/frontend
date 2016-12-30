(function(){
	'use strict';
	angular
		.module('finApp.investWithdraw',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/investWithdrawStart', {
				title : 'Invest/Withdraw',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/investwithdraw/views/investWidrawStart.html',
		        controller: 'investWithdrawController'
		    })
		    .when('/investStep1', {
				title : 'Build Your Smart Portfolio',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/investwithdraw/views/investStep1.html',
		        controller: 'investWithdrawController'
		    })
		    .when('/reviewInvestment', {
				title : 'Build Your Smart Portfolio',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/investwithdraw/views/reviewInvestment.html',
		        controller: 'investWithdrawController'
		    })
		    .when('/withdrawStart', {
				title : 'Withdraw',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/investwithdraw/views/withdrawStart.html',
		        controller: 'investWithdrawController'
		    })
		    .when('/investmentReturn', {
				title : 'Investment Status',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/investwithdraw/views/investmentReturn.html',
		        controller: 'investWithdrawController'
		    })
		}
})();