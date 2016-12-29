(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('identityInfoController',identityInfoController);

		identityInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','$timeout', 'registerInvestorService', 'identityInfoService','busyIndicator'];
		function identityInfoController($rootScope,$scope,$route,$http,$location,$timeout, registerInvestorService, identityInfoService,busyIndicator){
			this.scope = $scope;
			this.scope.modelVal = identityInfoService.initializeModel();

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			this.busyIndicator = busyIndicator;
			this.registerInvestorService = registerInvestorService;
			
			this.service = identityInfoService;
			
			var self = this;


			this.initialize();

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );

		}
		
		identityInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();