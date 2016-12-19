(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('investorInfoController',investorInfoController);

		investorInfoController.$inject = ['$rootScope','$scope','$http','investorInfoService'];
		function investorInfoController($rootScope,$scope,$http,investorInfoService){
			this.scope = $scope;
			this.scope.modelVal = {};

			this.rootScope = $rootScope;
			
			this.service = investorInfoService;
			
			var self = this;

			this.scope.showEquityModal = angular.bind( this, this.showEquityModal );

			this.initialize();

			$http.get('modules/common/config/contry.json').success(function(response) {
		        $scope.countryList = response;
		    });

			this.scope.saveInfo = angular.bind( this, this.saveInfo );
			
			this.scope.appendValue = angular.bind( this, this.appendValue );

			this.scope.imageUpload = angular.bind( this, this.imageUpload );

			this.scope.checkImageFile = angular.bind( this, this.checkImageFile );

			this.scope.uploadFileToServer = angular.bind( this, this.uploadFileToServer );
		}
})();