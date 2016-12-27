(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/recommendedSchemes', {
				title : 'Recommended Schemes',
				// subHeader : 'GO BACK TO '+ $rootScope.currentGoal +' GOAL',
				// redirectUrl : '/dashboard',
		        templateUrl: 'modules/smartportfolio/views/recommended.html',
		        controller: 'recommendedController'
		    })
		    .when('/compareAndModify', {
				title : 'Compare & Modify Schemes',
				// subHeader : 'GO BACK TO '+ $rootScope.currentGoal +' GOAL',
				// redirectUrl : '/dashboard',
		        templateUrl: 'modules/smartportfolio/views/compare.html',
		        controller: 'recommendedController'
		    })
		    .when('/schemeCompare', {
				title : 'Scheme Comparision',
				subHeader : 'GO BACK TO COMPARE & MODIFY',
				redirectUrl : '/compareAndModify',
		        templateUrl: 'modules/smartportfolio/views/schemeComparision.html',
		        controller: 'recommendedController'
		    })
		    .when('/schemeFactsheet', {
				title : 'Scheme Factsheet',
				subHeader : 'GO BACK TO RECOMMENDED SCHEMES',
				redirectUrl : '/recommendedSchemes',
		        templateUrl: 'modules/smartportfolio/views/schemeFactsheet.html',
		        controller: 'recommendedController'
		    })
		}
})();