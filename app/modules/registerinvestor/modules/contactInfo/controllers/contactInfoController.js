(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('contactInfoController',contactInfoController);

		contactInfoController.$inject = ['$rootScope','$scope','$route','$http','contactInfoService','registerInvestorService'];
		function contactInfoController($rootScope,$scope,$route,$http,contactInfoService, registerInvestorService){
			this.scope = $scope;
			this.scope.modelVal = {communicationAddress: {}, permanentAddress: {}};

			this.rootScope = $rootScope;
			this.route = $route;
			
			this.service = contactInfoService;
			
			var self = this;

			this.initialize();

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );
			
			this.lookupPincode = function(addressObject) {
				var self = this;
				registerInvestorService.lookupPincode(addressObject.pincode).then(function(data){
					if('success' in data){
						addressObject.city = data['success']['city'];
						addressObject.state = data['success']['state'];
					}
				});

			}

			this.scope.lookupPincode = angular.bind( this, this.lookupPincode );
			
			this.getKYCStatus = function() {
				return registerInvestorService.getKYCStatus();
			}

			this.scope.getKYCStatus = angular.bind( this, this.getKYCStatus );
			
			var Bank_Statement = 5,
	        	Utility_Bill = 6,
	        	Ration_Card = 7;
			
			this.scope.needBackImage = function(addressProofType) {
				console.log('step is: ' + this.step + ' selected: ' + $rootScope.selectedCriteria);
				if (addressProofType == Bank_Statement || addressProofType == Utility_Bill || 
						addressProofType == Ration_Card) {
					return false;
				}
				return true;
			};

			this.saveCommunicationAddressImage = function() {
				this.uploadFileToServer('frontImageUrl');
				if (this.scope['backImageUrl']) {
					this.uploadFileToServer('backImageUrl');
				}
			};

			this.scope.saveCommunicationAddressImage = angular.bind( this, this.saveCommunicationAddressImage );

			this.savePermanentAddressImage = function() {
				this.uploadFileToServer('permanentFrontImageUrl');
				if (this.scope['permanentBackImageUrl']) {
					this.uploadFileToServer('permanentBackImageUrl');
				}
			}
			this.scope.savePermanentAddressImage = angular.bind( this, this.savePermanentAddressImage);

		}
		
		contactInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();