(function () {
  "use strict";

	angular.module('crm.dashboard')

	// Retrieve available widgets
	.factory('crmDashboardWidgetGetService',
  ['$http', 'crm.dashboard.WIDGETS_GET_URL',
  function ($http, URL) {
  	return function (url, callback) {

  		var promise = $http.get(url || URL);
      if (callback) promise.then(callback, callback);
      return promise;

    };
  }]);

})();
