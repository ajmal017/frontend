(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalFormulaeService', goalFormulaeService)

        goalFormulaeService.$inject = ['$resource','$rootScope','appConfig','$q', 'assetAllocationService'];
        function goalFormulaeService($resource,$rootScope,appConfig,$q, assetAllocationService){
        	
        	var computeFVComponents = function(assetReturnRate, assetPercentage, tenure) {
	        	var monthlyRate = this.getCompoundedMonthlyRate(assetReturnRate);
        	
	        	var years = tenure || 0,
	        	    months = years * 12,
	        	    monthlyRatePlus1 = parseFloat(1 + monthlyRate);

	        	var assetPercentageNorm = parseFloat((assetPercentage)/100),
	        		
	        		assetPow = Math.pow(monthlyRatePlus1, months);
	        	
	        	var lumpsumComponent = assetPercentageNorm * assetPow,
	        		SIPComponent = assetPercentageNorm * monthlyRatePlus1 * (assetPow - 1)/monthlyRate;
	        	
	        	return [lumpsumComponent, SIPComponent];

        	},
        	
        	calculateSIP = function(years, corpus, lumpsum, assetAllocation) {
	        	var equityPercentage = parseFloat(assetAllocation.equity),
        			debtPercentage = parseFloat(assetAllocation.debt);
        		
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
	        	
	        	return computedSIP;
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
	        	
	        	var MONTH_FRACTION = parseFloat(1/12),
	        		yearlyRate = parseFloat(yearlyRatePercentage/100);
	        	
	        	return Math.pow((1 + yearlyRate), MONTH_FRACTION) - 1;
	        }
	        
	        //This calculates recommended value
	        function computeSIPForCorpus(goalData, assetAllocationCategory) {
	        	//FV = A x (1+R) x (((1+R) ^ n) – 1)/R
	        	if (typeof(goalData) === "undefined" || typeof(assetAllocationCategory) === "undefined" ||
	        			!goalData || !assetAllocationCategory) {
	        		return 0;
	        	}

	        	var years = goalData.tenure || 0,
	        	    corpus = goalData.corpus || 0,
	        	    lumpsum = goalData.lumpsum || 0,
	        	    computedSIP = 0,
	        	    assetAllocation,
	        	    targetAssetAllocationData;
	        	
	        	if (assetAllocationCategory == appConfig.assetAllocationCategory.OnlyEquity || 
	        		assetAllocationCategory == appConfig.assetAllocationCategory.OnlyDebt) {
		        	var assetAllocationData = assetAllocationService.computeAssetAllocation(assetAllocationCategory, 0, lumpsum);
	        		assetAllocation = assetAllocationData.assetAllocation;
		        	computedSIP = calculateSIP.call(this, years, corpus, lumpsum, assetAllocation);
		        	targetAssetAllocationData = assetAllocationData;
				}
	        	else {
	        		// Iterate through all possible allocation tables for this category, calculate the corresponding SIP and determine the best fit.
	        		// The best fit is where the SIP amount is greater than the min for the table.  
	        		var possibleAssetAllocations = assetAllocationService.getPossibleAssetAllocations(assetAllocationCategory, 0, lumpsum) || [];
	        		
	        		for (var i=0; i<possibleAssetAllocations.length; i++) {
		        		var assetAllocation = possibleAssetAllocations[i].assetAllocation;
			        	computedSIP = calculateSIP.call(this, years, corpus, lumpsum, assetAllocation);
			        	possibleAssetAllocations[i]['computedSIP'] = computedSIP;
	        		}
	        		
	        		for (var i=possibleAssetAllocations.length-1; i>=0; i--) {
	        			if (possibleAssetAllocations[i].computedSIP >= possibleAssetAllocations[i].minSIP) {
	        				// If the SIP amount is greater than the min SIP for the higher table, use that instead
	        				if (i+1 <= possibleAssetAllocations.length-1 && 
	        						possibleAssetAllocations[i].computedSIP > possibleAssetAllocations[i+1].minSIP) {
	        					computedSIP = possibleAssetAllocations[i+1].minSIP;
	        					assetAllocation = possibleAssetAllocations[i+1].assetAllocation;
		        				targetAssetAllocationData = possibleAssetAllocations[i+1];
	        				}
	        				else {
		        				computedSIP = possibleAssetAllocations[i].computedSIP;
		        				assetAllocation = possibleAssetAllocations[i].assetAllocation;
		        				targetAssetAllocationData = possibleAssetAllocations[i];
	        				}
	        				break;
	        			}
	        		}
	        	}
	        	
	        	return {"computedSIP" : computedSIP, "assetAllocation" : assetAllocation, "targetAssetAllocationData" : targetAssetAllocationData};
	        	
	        }
	        
	        //This is used when user changes SIP value
	        function computeCorpusForSIP(goalData, assetAllocationCategory) {
	        	//FV = A x (1+R) x (((1+R) ^ n) – 1)/R
	        	if (typeof(goalData) === "undefined" || typeof(assetAllocationCategory) === "undefined" ||
	        			!goalData || !assetAllocationCategory) {
	        		return 0;
	        	}

	        	var years = goalData.tenure || 0,
	        	    sip = goalData.sip || 0,
	        	    lumpsum = goalData.lumpsum || 0;

	        	var assetAllocationData = assetAllocationService.computeAssetAllocation(assetAllocationCategory, sip, lumpsum),
	        		assetAllocation = assetAllocationData.assetAllocation;
	        	
	        	
	        	var equityPercentage = parseFloat(assetAllocation.equity),
	        		debtPercentage = parseFloat(assetAllocation.debt);
	        		
	        	var equityComponents = computeFVComponents.call(this, appConfig.returnRate.equity, equityPercentage, years),
	        		debtComponents = computeFVComponents.call(this, appConfig.returnRate.debt, debtPercentage, years);
	        	
	        	var equityLumpsumComponent = lumpsum * equityComponents[0],
	        		debtLumpsumComponent = lumpsum * debtComponents[0],
	        		equitySIPComponent = sip * equityComponents[1],
	        		debtSIPComponent = sip * debtComponents[1];
	        	
	        	var computedCorpus = equityLumpsumComponent + debtLumpsumComponent+ equitySIPComponent + debtSIPComponent;
	        	
	        	
	        	return {"computedCorpus" : computedCorpus, "assetAllocation" : assetAllocation};
	        }

        }
        

})();