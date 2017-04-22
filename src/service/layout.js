(function () {
  "use strict";

  angular.module('crm.dashboard')

	// Retrieve available layouts
	.factory('crmDashboardLayoutGetService',
  ['crm.dashboard.LAYOUTS_GET_URL', '$http', '$q',
  function (URL, $http, $q) {
  	return function (url, callback) {

  		var promise = $http.get(url || URL);
  		if (callback) promise.then(callback, callback);
  		return promise;

  	};
  }])

	// Get dashboard instances
	.factory('crmDashboardInstanceGetService',
  ['crm.dashboard.INSTANCES_GET_URL', '$http', '$q',
  function (URL, $http, $q) {
  	return function (url, callback) {

  		var promise = $http.get(url || URL);
  		if (callback) promise.then(callback, callback);
  		return promise;

  	};
  }])

	// Post dashboard instances
	.factory('crmDashboardInstanceSetService',
  ['crm.dashboard.INSTANCES_SET_URL', '$http', '$q',
  function (URL, $http, $q) {
  	return function (url, data, callback) {
  		
  		// Only store the instances signature which is the widget 'type', 'params' per 'containerName'.
  		var _instances = {}, containerName;
  		for (containerName in data.widgetsInstances) {
  			_instances[containerName] = [];
  			data.widgetsInstances[containerName].forEach(function (inst) {
  				// Note: the 'title' is not a part of the widget signature.
  				// But just in case the widget will not be more available in the future,
  				// we'll need to be able to display a message saying the "Your [TITLE] widget is no more available...".
  				_instances[containerName].push({ type: inst.type, params: inst.params, title: inst.title });
  			});
  		}
  		data.widgetsInstances = _instances;

  		// In dev environment, this service might not implemented yet...
  		if (!(url || URL)) {
  			console.log('Ready to save the dashboard instances', data);
  			console.log(JSON.stringify(data));
  			var deferred = $q.defer();
  			deferred.resolve({ data: undefined });
  			return deferred.promise;
  		}

  		// Notice: the data object have 2 properties: data.layoutFile and data.widgetsInstances
  		var promise = $http.post(url || URL, data);
  		if (callback) promise.then(callback, callback);
  		return promise;

  	};
  }]);

})();
