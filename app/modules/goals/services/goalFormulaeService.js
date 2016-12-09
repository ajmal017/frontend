(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalFormulaeService', goalsService)

        goalFormulaeService.$inject = ['$resource','$rootScope','appConfig','$q', 'assetAllocationService'];
        function goalFormulaeService($resource,$rootScope,appConfig,$q, assetAllocationService){
        	
        	var computeFVComponents = function(assetReturnRate, assetPercentage, tenure) {
	        	var monthlyRate = this.getCompoundedMonthlyRate(assetReturnRate);
        	
	        	var years = tenure || 0,
	        	    months = years * 12,
	        	    monthlyRatePlus1 = float(1 + monthlyRate);

	        	var assetPercentageNorm = float((assetPercentage)/100),
	        		
	        		assetPow = Math.pow(monthlyRatePlus1, months);
	        	
	        	var lumpsumComponent = assetPercentageNorm * assetPow,
	        		SIPComponent = assetPercentageNorm * monthlyRatePlus1 * (assetPow - 1)/monthlyRate;
	        	
	        	return [lumpsumComponent, SIPComponent];

        	};
        	
            return{
        		getCompoundedMonthlyRate : getCompoundedMonthlyRate,
        		computeSIPForCorpus : computeSIPForCorpus,
        		computeCorpusForSIP : computeCorpusForSIP
        	}

	        function getCompoundedMonthlyRate(yearlyRatePercentage){
	        	if (typeof(yearlyRatePercentage) === "undefined" || !yearlyRatePercentage) {
	        		return 0;
	        	}
	        	
	        	var MONTH_FRACTION = float(1/12),
	        		yearlyRate = float(yearlyRatePercentage/100);
	        	
	        	return Math.pow((1 + yearlyRate), MONTH_FRACTION) - 1;
	        }
	        
	        function computeSIPForCorpus(goalData, assetAllocationCategory) {
	        	//FV = A x (1+R) x (((1+R) ^ n) – 1)/R
	        	if (typeof(goalData) === "undefined" || typeof(assetAllocationCategory) === "undefined" ||
	        			!goalData || !assetAllocationCategory) {
	        		return 0;
	        	}

	        	var years = goalData.tenure || 0,
	        	    corpus = goalData.corpus || 0,
	        	    lumpsum = goal.lumpsum || 0;
	        	

	        	var assetAllocationData = assetAllocationService.computeAssetAllocation(assetAllocationCategory, 0, lumpsum),
	        		assetAllocation = assetAllocationData.assetAllocation;
	        	
	        	
	        	var equityPercentage = float(assetAllocation.equity || 0),
	        		debtPercentage = float(assetAllocation.debt || 100);
	        		
	        	var equityComponents = computeFVComponents.call(this, appConfig.returnRate.equity, equityPercentage, years),
	        		debtComponents = computeFVComponents.call(this, appConfig.returnRate.debt, debtPercentage, years);
	        	
	        	var equityLumpsumComponent = lumpsum * equityComponents[0],
	        		debtLumpsumComponent = lumpsum * debtComponents[0],
	        		equitySIPComponent = equityComponents[1],
	        		debtSIPComponent = debtComponents[1];
	        	
	        	var computedSIP = (corpus - equityLumpsumComponent - debtLumpsumComponent)/(equitySIPComponent + debtSIPComponent);
	        	
	        	//Round to 100
	        	computedSIP = Math.ceil(computedSIP/100) * 100;
	        	
	        	// Min SIP 1000
	        	computedSIP = Math.max(computedSIP, 1000);
	        	
	        	computedSIP = Math.max(computedSIP, assetAllocationData.minSIP);
	        	
	        	return computedSIP;
	        }
	        
	        function computeCorpusForSIP(goalData, assetAllocationCategory) {
	        	//FV = A x (1+R) x (((1+R) ^ n) – 1)/R
	        	if (typeof(goalData) === "undefined" || typeof(assetAllocationCategory) === "undefined" ||
	        			!goalData || !assetAllocationCategory) {
	        		return 0;
	        	}

	        	var years = goalData.tenure || 0,
	        	    sip = goalData.sip || 0,
	        	    lumpsum = goal.lumpsum || 0;
	        	

	        	var assetAllocationData = assetAllocationService.computeAssetAllocation(assetAllocationCategory, sip, lumpsum),
	        		assetAllocation = assetAllocationData.assetAllocation;
	        	
	        	
	        	var equityPercentage = float(assetAllocation.equity || 0),
	        		debtPercentage = float(assetAllocation.debt || 100);
	        		
	        	var equityComponents = computeFVComponents.call(this, appConfig.returnRate.equity, equityPercentage, years),
	        		debtComponents = computeFVComponents.call(this, appConfig.returnRate.debt, debtPercentage, years);
	        	
	        	var equityLumpsumComponent = lumpsum * equityComponents[0],
	        		debtLumpsumComponent = lumpsum * debtComponents[0],
	        		equitySIPComponent = sip * equityComponents[1],
	        		debtSIPComponent = sip * debtComponents[1];
	        	
	        	var computedCorpus = equityLumpsumComponent + debtLumpsumComponent+ equitySIPComponent + debtSIPComponent;
	        	
	        	
	        	return computedCorpus;
	        }

        }
        

})();