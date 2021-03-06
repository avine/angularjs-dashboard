(function () {
  "use strict";

	angular.module('avn.dashboard')

	// Retrieve available widgets
	.factory('avnDashboardWidgetGetService',
  ['$http', 'avn.dashboard.WIDGETS_GET_URL',
  function ($http, URL) {
  	return function (url, callback) {

  		var promise = $http.get(url || URL);
      if (callback) promise.then(callback, callback);
      return promise;

    };
  }]);

})();
