(function(){
	'use strict';
	angular
		.module('finApp.trackPerformance',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/trackPerformanceStart', {
				title : 'Track Performance',
				subHeader : 'GO BACK TO DASHBOARD',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/trackperformance/views/trackPerformanceStart.html',
		        controller: 'trackPerformanceController'
		    })
		}
})();