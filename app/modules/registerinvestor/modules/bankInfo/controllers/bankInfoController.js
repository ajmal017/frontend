(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('bankInfoController',bankInfoController);

		bankInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','$timeout','registerInvestorService','bankInfoService','busyIndicator','ngDialog'];
		function bankInfoController($rootScope,$scope,$route,$http,$location,$timeout, registerInvestorService, bankInfoService,busyIndicator,ngDialog){
			this.scope = $scope;
			this.scope.modelVal = {};

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
			this.busyIndicator = busyIndicator;
			this.registerInvestorService = registerInvestorService;
			
			this.service = bankInfoService;
			this.scope.is_acc_supported = true;
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
				self.busyIndicator.show();
				this.service.lookupIFSCCode(this.scope.modelVal.ifscCode).then(function(data){
					self.busyIndicator.hide();
					if('success' in data){
						angular.extend(self.scope.modelVal, data['success']);
						$rootScope.is_bank_supported = data.success.bank_supported;
						if(data.success.bank_supported == false) {
							$scope.errorPopupMessage = 'Your bank is not supported by our payment gateway. \nYou can change your bank or you will guided to other payment options (Cheque payment).';
							$scope.ngDialog = ngDialog;
							ngDialog.open({ 
					        	template: 'modules/common/views/partials/error_popup.html', 
					        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
					        	overlay: false,
					        	showClose : false,

					        	scope: $scope
				        	});
						}
					}
				}, function() {
					self.busyIndicator.hide();
				});

			};

			this.lookupAccNum = function() {
				console.log('acc num');
				var self = this;
				self.busyIndicator.show();
				this.service.lookupAccNum(this.scope.modelVal).then(function(data){
					self.busyIndicator.hide();
					if('Message' in data){
						// angular.extend(self.scope.modelVal, data['success']);
						 self.scope.is_acc_supported = false;
						// if(data.success.bank_supported == false) {
							$scope.errorPopupMessage = data.Message;
							$scope.ngDialog = ngDialog;
							ngDialog.open({ 
					        	template: 'modules/common/views/partials/error_popup.html', 
					        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
					        	overlay: false,
					        	showClose : false,

					        	scope: $scope
				        	});
						// }
					} else if('success' in data) {
						self.scope.is_acc_supported = true;
					}
				}, function() {
					self.busyIndicator.hide();
				});
			}

			this.scope.lookupIFSCCode = angular.bind( this, this.lookupIFSCCode );
			this.scope.lookupAccNum = angular.bind( this, this.lookupAccNum );

		}
		
		bankInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();