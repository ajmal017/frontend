(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('bankInfoController',bankInfoController);

		bankInfoController.$inject = ['$rootScope','$scope','$route','$http','$location','$timeout','bankInfoService','busyIndicator','ngDialog'];
		function bankInfoController($rootScope,$scope,$route,$http,$location,$timeout, bankInfoService,busyIndicator,ngDialog){
			this.scope = $scope;
			this.scope.modelVal = {};

			this.rootScope = $rootScope;
			this.route = $route;
			this.location = $location;
			this.timeout = $timeout;
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
					        	template: '/modules/common/views/partials/error_popup.html', 
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

			this.scope.lookupIFSCCode = angular.bind( this, this.lookupIFSCCode );
		}
		
		bankInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();