(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('othersService', othersService);

        othersService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function othersService($resource,$rootScope,appConfig,$q){
        	
        	var modelObject = {};
        	
            return{
            	getSavedValues : getSavedValues,
            	setSavedValues : setSavedValues,
        		getCorpusEstimates : getCorpusEstimates
        	}

	        function getSavedValues(){
                var eventsAnswers = {};
                var d = new Date();
                
                eventsAnswers = $rootScope.userFlags['user_answers']['event'];
                console.log('eventsAnswers',eventsAnswers);
                modelObject.A1 = eventsAnswers['goal_name'];

                modelObject.A3 = eventsAnswers['corpus'];
                modelObject.A2 = parseInt(d.getFullYear() + eventsAnswers['term']);
                
                return modelObject;
	        }

	        function setSavedValues(){               
	        }

            function getCorpusEstimates() {
            }
        }     
})();