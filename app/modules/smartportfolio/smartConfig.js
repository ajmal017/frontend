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
				subHeader : 'GO BACK TO RETIREMENT GOAL',
				redirectUrl : '/dashboard',
		        templateUrl: 'modules/smartportfolio/views/recommended.html',
		        controller: 'recommendedController'
		    })
		    .when('/compareAndModify', {
				title : 'Compare & Modify Schemes',
				subHeader : 'GO BACK TO RETIREMENT GOAL',
				redirectUrl : '/dashboard',
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
		}
})();