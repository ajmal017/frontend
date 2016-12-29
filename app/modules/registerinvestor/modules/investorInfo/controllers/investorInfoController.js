(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('investorInfoController',investorInfoController);

		investorInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','$timeout', 'registerInvestorService', 'investorInfoService','busyIndicator'];
		function investorInfoController($rootScope,$scope,$route,$http,$location,$timeout, registerInvestorService, investorInfoService,busyIndicator){
			this.scope = $scope;
			this.scope.modelVal = investorInfoService.initializeModel();

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			this.busyIndicator = busyIndicator;
			this.registerInvestorService = registerInvestorService;
			
			this.service = investorInfoService;
			
			var self = this;

			this.initialize();

			$http.get('modules/common/config/contry.json').success(function(response) {
		        $scope.countryList = response;
		    });

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );

			this.checkKYCStatus = function() {
				var self = this;
				self.busyIndicator.show();
				this.service.getKYCStatus(this.scope.modelVal.panNumber).then(function(data){
					self.busyIndicator.hide();
					if('success' in data){
						self.scope.modelVal.kycStatus = data['success']['status'];
						if (self.scope.modelVal.kycStatus) {
							self.scope.modelVal.applicantName = data['success']['name'];
						}
					}
				}, function() {
					self.busyIndicator.hide();
				});

			};

			this.scope.checkKYCStatus = angular.bind( this, this.checkKYCStatus );
		}
		
		investorInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();