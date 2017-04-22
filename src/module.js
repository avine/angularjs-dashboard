(function () {
	"use strict";

	angular.module('crm.dashboard', [])

	// Tip: You can set default values for PATH and each service URL
	// Or even overwrite this configuration by providing the 'config' attribute like this:
	// <crm-dashboard-layout config="_USE_SCOPE_BINDING_">

	.constant('crm.dashboard.PATH', 'src/')

	.constant('crm.dashboard.LAYOUTS_GET_URL', undefined)

	.constant('crm.dashboard.WIDGETS_GET_URL', undefined)

	.constant('crm.dashboard.INSTANCES_GET_URL', undefined)
	.constant('crm.dashboard.INSTANCES_SET_URL', undefined)

  ;

})();
