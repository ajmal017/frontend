(function(){
	'use strict';
	angular
		.module('finApp.planInvest')
		.controller('taxsavingController',taxsavingController);

		taxsavingController.$inject = ['$scope','$rootScope','$location','taxsavingService']
		function taxsavingController($scope,$rootScope,$location,taxsavingService){
			$scope.appendFormValues = function(data){
				alert(JSON.stringify(data));
			}
			$scope.showEquityModal = function(){
				$('#equiDeptModal').modal('show');
			}
		}
})();