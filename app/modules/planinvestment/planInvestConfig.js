(function(){
	'use strict';
	angular
		.module('finApp.planInvest',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/planInvest', {
				title : 'Plan Investments',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/planinvestment/views/planinvest.html',
		        controller: 'planInvestController'
		    })
		}
})();