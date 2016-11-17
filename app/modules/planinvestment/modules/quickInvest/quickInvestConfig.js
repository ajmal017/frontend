(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/quickInvest', {
				title : 'Quick Invest',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/planinvestment/modules/quickInvest/views/quickIvest.html',
		        controller: 'quickInvestController'
		    })
		    .when('/quickInvestStart', {
				title : 'Quick Invest',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/planinvestment/modules/quickInvest/views/quickInvestStart.html',
		        controller: 'quickInvestController'
		    })
		}
})();