/*
Copyright Â© 2016, FinAskUs
Written under contract by Robosoft Technologies Pvt. Ltd.
*/
(function(){
	'use strict';
	angular.module('finApp',[
		'ngRoute',
		'ngResource',
		'ngSanitize',
		'ngScrollbars',
		'datepicker',
		'finApp.config',
		'finApp.directives',
		'finApp.text',
		'finApp.services',
		'finApp.filters',
		'angularLazyImg',
		'finApp.auth',
		'finApp.registration',
		'finApp.riskAssesment',
		'finApp.dashboard',
		'finApp.planInvest',
		'finApp.goals',
		'finApp.registerInvestor',
		'finApp.smartPortFolio',
		'finApp.investWithdraw',
		'finApp.trackPerformance'
	])
	.config(config)
	.run(run);

	config.$inject = ['$routeProvider','$httpProvider','$resourceProvider','ScrollBarsProvider'];
	function config($routeProvider,$httpProvider,$resourceProvider,ScrollBarsProvider){
		$routeProvider
			.when('/', {
				title : '',
                templateUrl: 'modules/authentication/views/login.html',
                controller: 'authController'
            })
            .when('/widgets', {
            	title : '',
                templateUrl: 'modules/common/views/widgets.html'
            })
            .otherwise({
                redirectTo: '/404',
                title : 'Page not found',
                templateUrl: 'modules/common/views/404.html'
            });
		$httpProvider.interceptors.push('finWebInterCepter');
		$resourceProvider.defaults.stripTrailingSlashes = false;
	}
	run.$inject = ['$route','$routeParams','$rootScope','$location','appConfig','checkPath','busyIndicator'];
	function run($route,$routeParams,$rootScope,$location,appConfig,checkPath,busyIndicator){
		$rootScope.userDetails = JSON.parse(sessionStorage.getItem('userDetails'))||{};
		$rootScope.drawerOpen = false;
		$rootScope.selectedCriteria = null;
		var history = [],prevUrl,pos;
		$rootScope.$on('$locationChangeStart', function(event, current, previous) {
			if($rootScope.drawerOpen == true) $rootScope.drawerAnimate();
			$rootScope.getStarted = checkPath($location.path(),appConfig.pagesWithAlreadySignMsg);
			$rootScope.menu = checkPath($location.path(),appConfig.pagesWithOnlyMenu);
			$rootScope.isRestricted = checkPath($location.path(),appConfig.restrictedPages);
			$rootScope.userFlags = JSON.parse(sessionStorage.getItem('userFlags'))||{};
			history.push($location.path());
		});
		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			$rootScope.title = $route.current.title;
			$rootScope.subHeader = $route.current.subHeader;
			$rootScope.redirectURL = $route.current.redirectUrl;
			$rootScope.loggedIn = !!$rootScope.userDetails.user;
			if(!$rootScope.loggedIn && $rootScope.isRestricted){
				$location.path('/');
			}else if($location.path() == '/' &&
				$rootScope.loggedIn){
				$location.path('/dashboard');
			}
		});
		
		$rootScope.userLogout = function(){
			$rootScope.$broadcast('userloggedOut');
		}

		$rootScope.$on('userloggedIn', function(event, data) {
			sessionStorage.setItem('userDetails', JSON.stringify({'user':data['user']}));
			sessionStorage.setItem('tokens', JSON.stringify({'tokens':data['tokens']}));
		});
		$rootScope.$on('refreshCredentials', function(event, data) {
			sessionStorage.setItem('userFlags', JSON.stringify(data));
		});
        $rootScope.$on('userloggedOut', function(event, args) {
        	$location.path('/');
            sessionStorage.clear(); 
            if(!$rootScope.$$phase)	$rootScope.$apply();       
        });

        $rootScope.back = function() {
        	prevUrl = history.length > 0 ? history.splice(-2)[0] : "/";
            $location.path(prevUrl);
        }
        $rootScope.updateLocalValue = function(storageKey,type,compare,key,value){
        	var object = (type == 'local')?JSON.parse(localStorage.getItem(storageKey)):
        		JSON.parse(sessionStorage.getItem(storageKey));
			if(compare in object){
				object[compare][key] = value; 
			}
		}
		window.addEventListener("online", function() { 
			$rootScope.online = true;  
		}, false);

		window.addEventListener("offline", function() { 
			$rootScope.online = false;   
		}, false);

		$rootScope.$watch('online', function(newStatus) {
            if (newStatus == false) {
            }
        });

        $rootScope.drawerAnimate = function(){
			if($('.drawer').hasClass('open')){
				$('.drawer').removeClass('open');
		        $('.drawer-overlay').removeClass('open');
		        $('.page-wrapper').removeClass('open');
		        $('.bar1,.bar2').removeClass('open');
		        $rootScope.drawerOpen = false;
			}else{
				$('.drawer').addClass('open');
		        $('.drawer-overlay').addClass('open');
		        $('.page-wrapper').addClass('open');
		        $('.bar1,.bar2').addClass('open');
		        $rootScope.drawerOpen = true;
			}	        
	    };
	}
})();