(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/earnInterestStart', {
				title : 'Earn Higher Interest',
				subHeader : 'GO BACK TO PLAN INVESTMENTS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/planinvestment/modules/earnInterest/views/earnInterestStart.html',
		        controller: 'earnInterestController'
		    })
		  //   .when('/quickInvestStart', {
				// title : 'Quick Invest',
				// subHeader : 'GO BACK TO DASHBOARD',
				// redirectUrl : '/dashboard',
		  //       templateUrl: 'modules/planinvestment/modules/quickInvest/views/quickInvestStart.html',
		  //       controller: 'quickInvestController'
		  //   })
		}
})();