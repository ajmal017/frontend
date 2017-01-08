(function() {
    'use strict';
    angular
        .module('finApp.planInvest')
        .factory('earnInterestService', earnInterestService);

        earnInterestService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function earnInterestService($resource,$rootScope,appConfig,$q){
        	
            var modelObject = {};
            
             return{
                getSavedValues : getSavedValues,
                setSavedValues : setSavedValues,
                
            }

	        function getSavedValues(){
                var investAnswers = {};
                investAnswers = $rootScope.userFlags['user_answers']['liquid'];
                console.log('investAnswers',investAnswers);
                modelObject.A1 = investAnswers['goal_name'];
                modelObject.A2 = investAnswers['amount_invested'];
                return modelObject;
            }

            function setSavedValues(model){         
                var modelObject = {};
                var modelObject = model;
                sessionStorage.setItem('goalDetailsTemp', JSON.stringify(modelObject));      
            }

        }     
})();