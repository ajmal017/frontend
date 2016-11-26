(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/taxsaving', {
				title : 'Save Tax',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/planinvestment/modules/taxsaving/views/taxsaving.html',
		        controller: 'taxsavingController'
		    })
		    .when('/taxsavingStarted', {
				title : 'Save Tax',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/planinvestment/modules/taxsaving/views/taxsavingStarted.html',
		        controller: 'taxsavingController'
		    })
		}
})();