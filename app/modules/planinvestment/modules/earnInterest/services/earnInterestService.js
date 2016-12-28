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
                // var investAnswers = {};
                // investAnswers = $rootScope.userFlags['user_answers']['invest'];
                // console.log('investAnswers',investAnswers);
                // modelObject.A1 = investAnswers['goal_name'];
                // modelObject.A2 = investAnswers['sip'];
                // modelObject.A3 = investAnswers['term'];
                // modelObject.A4 = investAnswers['lumpsum'];
                return modelObject;
            }

            function setSavedValues(){               
            }

        }     
})();