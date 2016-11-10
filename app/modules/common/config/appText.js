/*
Copyright Â© 2016, FinAskUs
Written under contract by Robosoft Technologies Pvt. Ltd.
*/
(function() {
	'use strict';
	angular.module('finApp.text', [])
		.value('appText', {
			"error": {
				'server_error': 'Internal server error',
				'no_data' : 'OOPS! No data found.',
			}
		});
})();
