(function () {
	"use strict";

	angular.module('crm.dashboard').directive('crmDashboardWidget',
  ['crm.dashboard.PATH', '$compile',
  function (PATH, $compile) {
  	return {

  		require: '^crmDashboardContainer',

  		scope: {
  			details: '='
  		},

  		link: function (scope, element, attrs, containerCtrl) {

  			scope.remove = function ($event) {
  				$event.preventDefault();
  				containerCtrl.removeWidget(scope.details.index);
  			};
  			scope.moveDown = function ($event) {
  				$event.preventDefault();
  				containerCtrl.moveDownWidget(scope.details.index);
  			};
  			scope.moveUp = function ($event) {
  				$event.preventDefault();
  				containerCtrl.moveUpWidget(scope.details.index);
  			};

  			// All directives of widget item have a unique prefix which is:
  			//			"crmDashboardWidgetItem"
  			// By convention, the params.type represents the directive suffix in camel case.
  			// For example, if the params.type is:
  			//			"UserList"
  			// then the full name of the directive is:
  			//			"crmDashboardWidgetItemUserList"
  			// In this case, the directive attribute inserted in the DOM is:
  			//			<div crm-dashboard-widget-item-user-list"></div>
  			var directiveName = 'crmDashboardWidgetItem' + scope.details.type,
  					directiveAttr = jsProp2HtmlAttr(directiveName);

  			//// For debugging you can check the following assertion
  			//console.log(directiveName, directiveAttr, directiveName === htmlAttr2JsProp(directiveAttr));

  			// Give the widget item all revelant details
  			scope.config = {
  				params: scope.details.params,
  				title: scope.details.title,
  				wrap: scope.details.wrap,
  				directiveName: directiveName,
  				directiveAttr: directiveAttr
  			};

  			// Compile the widget item directive
  			element.find('.crm-dashboard-widget-content').append(
					$compile('<div ' + directiveAttr + ' config="config"></div>')(scope)[0]
        );
  		},

  		templateUrl: PATH + 'template/widget.html'

  	};
  }]);

	// Convert HTML attribute to JS property
	function htmlAttr2JsProp(name) {
		name = name.replace(/^\-/, '').split('-');
		for (var n = name.length, i = 1; i < n; i++) name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
		return name.join('');
	}

	// Convert JS property to HTML attribute
	function jsProp2HtmlAttr(name) {
		var css = '', start = 0, upper = /[A-Z]/g, pos;
		while (true === upper.test(name)) {
			pos = upper.lastIndex - 1;
			css += name.substr(start, pos - start);
			if (0 != pos) css += '-';
			css += name.charAt(pos).toLowerCase();
			start = upper.lastIndex;
		}
		css += name.substr(start);
		return css;
	}

})();
