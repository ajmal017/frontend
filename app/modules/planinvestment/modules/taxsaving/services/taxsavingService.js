(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('taxsavingService', taxsavingService);

        taxsavingService.$inject = ['$resource','$rootScope','appConfig','$q','$route'];
        function taxsavingService($resource,$rootScope,appConfig,$q,$route){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues
        	}

	        function getSavedValues(){

                var taxSavingAnswers = {};
                taxSavingAnswers = $rootScope.userFlags['user_answers']['tax'];
                console.log('taxSavingAnswers',taxSavingAnswers);
                modelObject.A2 = taxSavingAnswers.amount_invested;
                modelObject.A3 = taxSavingAnswers.pff;
                modelObject.A4 = taxSavingAnswers.insurance;
                modelObject.A5 = taxSavingAnswers.loan;
                modelObject.A6 = taxSavingAnswers.elss;
                modelObject.A1 = taxSavingAnswers.goal_name;
                if(taxSavingAnswers.estimate_needed == 'op2') {
                    $rootScope.selectedCriteria = 'op2';
                    
                }
	        	return modelObject;
	        }

            function getTaxData() {
                var eligibility = $scope.modelVal.A2 || 0;
                var taxBenefit = Math.round(eligibility * 30.9/100);
                
                $scope.taxsaving['taxBenefit'] = taxBenefit;
            }

	        function setSavedValues(){               
	        }

        }     
})();