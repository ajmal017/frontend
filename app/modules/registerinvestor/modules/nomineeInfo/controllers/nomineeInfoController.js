(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('nomineeInfoController',nomineeInfoController);

		nomineeInfoController.$inject = ['$rootScope','$scope','$route','$http','nomineeInfoService'];
		function nomineeInfoController($rootScope,$scope,$route,$http,nomineeInfoService){
			this.scope = $scope;
			this.scope.modelVal = {};

			this.rootScope = $rootScope;
			this.route = $route;
			
			this.service = nomineeInfoService;
			
			var self = this;


			this.initialize();

			this.scope.reloadRoute = angular.bind( this, this.reloadRoute );
			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );
			
			this.scope.showGuardian = function() {
				if (self.scope.modelVal.nomineeDob) {
					var currentDate = new Date(),
						dob = new Date(self.scope.modelVal.nomineeDob);
					
					if ((currentDate.getFullYear() - dob.getFullYear()) < 18) {
						return true;
					}
				}
				else {
					return true;
				}
				return false;
			}

		}
		
		nomineeInfoController.prototype = finApp.registerInvestorControllerPrototype;
})();