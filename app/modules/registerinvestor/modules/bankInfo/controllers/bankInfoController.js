(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('bankInfoController',bankInfoController);

		bankInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','bankInfoService','busyIndicator'];
		function bankInfoController($rootScope,$scope,$route,$http,$location,bankInfoService,busyIndicator){
			this.scope = $scope;
			this.scope.modelVal = {};

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.busyIndicator = busyIndicator;
			
			this.service = bankInfoService;
			
			var self = this;


			this.initialize();

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );

			this.lookupIFSCCode = function() {
				var self = this;
				this.service.lookupIFSCCode(this.scope.modelVal.ifscCode).then(function(data){
					if('success' in data){
						angular.extend(self.scope.modelVal, data['success']);
						//TODO prompt for supported banks
					}
				});

			};

			this.scope.lookupIFSCCode = angular.bind( this, this.lookupIFSCCode );
		}
		
		bankInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();