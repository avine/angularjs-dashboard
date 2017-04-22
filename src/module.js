(function () {
	"use strict";

	angular.module('avn.dashboard', [])

	// Tip: You can set default values for PATH and each service URL
	// Or even overwrite this configuration by providing the 'config' attribute like this:
	// <avn-dashboard-layout config="_USE_SCOPE_BINDING_">

	.constant('avn.dashboard.PATH', 'src/')

	.constant('avn.dashboard.LAYOUTS_GET_URL', undefined)

	.constant('avn.dashboard.WIDGETS_GET_URL', undefined)

	.constant('avn.dashboard.INSTANCES_GET_URL', undefined)
	.constant('avn.dashboard.INSTANCES_SET_URL', undefined)

  ;

})();
