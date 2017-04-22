(function () {
	"use strict";

	var prefix = 'avnDashboardWidgetItem';

	angular.module('avn.dashboard')

  .directive(prefix + 'HelloWorld', [function () {
  	return {
  		scope: {
  			config: '=' // Contains the widget configuration details
  		},
  		link: function (scope, element, attrs) {

  		},
  		template: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>'
  	};
  }])

	.directive(prefix + 'LoremIpsum', [function () {
		return {
			scope: {
				config: '=' // Contains the widget configuration details
			},
			link: function (scope, element, attrs) {

			},
			template: '<h1>{{config.title}}</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>'
		};
	}])

	.directive(prefix + 'Welcome', [function () {
		return {
			scope: {
				config: '=' // Contains the widget configuration details
			},
			link: function (scope, element, attrs) {

			},
			template: '<div class="alert alert-success">Welcome {{config.params.firstName}}  {{config.params.lastName}}</div>'
		};
	}])

	.directive(prefix + 'News', [function () {
		return {
			scope: {
				config: '=' // Contains the widget configuration details
			},
			link: function (scope, element, attrs) {

			},
			template: '{{config.params.message}}'
		};
	}])

	;

})();
