(function () {
  "use strict";

	angular.module('avn.dashboard')

	// Include this element directive in the page to load the dashboard
	// <avn-dashboard-layout data-editable="true"></avn-dashboard-layout>
  .directive('avnDashboardLayout',
  ['avn.dashboard.PATH', 'avnDashboardLayoutGetService', 'avnDashboardWidgetGetService',
		'avnDashboardInstanceGetService', 'avnDashboardInstanceSetService', '$q',
  function (PATH, layoutGetService, widgetGetService, instanceGetService, instanceSetService, $q) {
    return {

      restrict: 'E',

      replace: true,

      scope: {
      	config: '='
      },

      link: function (scope, element, attrs) {
				// Optional services configuration
      	scope.config = scope.config || {
      		layoutsGetUrl: undefined,
      		widgetsGetUrl: undefined,
      		instancesGetUrl: undefined,
      		instanceSetUrl: undefined
      	};
				// Is the UI editable ?
        scope.isEditable = undefined === attrs.editable ? true : !!scope.$eval(attrs.editable);
        // Current selected layout
        scope.layoutIndex = undefined;
        // List of identified containers in the selected layout
        scope.containers = [];
        // List of instantiated widgets in the UI
        scope.instances = {};
        // UI messages
        scope.messages = [];

        // Request data from services
        $q.all([
          layoutGetService(scope.config.layoutsGetUrl),
          widgetGetService(scope.config.widgetsGetUrl),
          instanceGetService(scope.config.instancesGetUrl)
        ]).then(function (responses) {
          // List of available layouts
          scope.layouts = responses[0].data;
          // List of available widgets
          scope.widgets = responses[1].data;
          // Retrieve scope.layoutIndex and scope.instances from stored dashboard
          var dashboard = responses[2].data;
          if (dashboard) {
            scope.layoutIndex = getLayoutIndex(dashboard.layoutFile);
            if (undefined === scope.layoutIndex) {
              addMessage('Your selected layout is no more available. Please select a new layout.');
            }
            scope.instances = dashboard.widgetsInstances;
          }
        }, function () {
          addMessage('Sorry! An error occured. Unable to display your dashboard.');
        });

				// Toggle edit mode
        scope.toggleEdit = function (bool) {
          scope.edit = arguments.length ? !!bool : !scope.edit;
					// Store dashboard
          if (!scope.edit && undefined !== scope.layoutIndex) {
          	instanceSetService(scope.config.instanceSetUrl, {
          		layoutFile: scope.layouts[scope.layoutIndex].file,
          		widgetsInstances: scope.instances
          	});
          }
        };

      	// Handle layout selection
        scope.$on('selectLayoutIndex', function (e, index) {
        	e.preventDefault();
        	// Notice: the event is triggered each time scope.edit becomes true
        	// For this reason, we should not reset the scope state if the layoutIndex is unchanged...
        	if (scope.layoutIndex === index) return;
        	// Reset scope state
        	scope.containers = [];
        	scope.widgets.forEach(function (widget) { delete widget.hidden; });
					// Update layout index which triggers the entire process...
        	scope.layoutIndex = index;
        });

				// Set the ng-include path to load the selected layout
        scope.getLayoutPath = function () {
          if (undefined !== scope.layoutIndex)
            return PATH + 'layout/' + scope.layouts[scope.layoutIndex].file;
        };
      	// When the layout is loaded by the ng-include and before it's parsed by Angular,
        // determine the number of containers it contains
        scope.getContainersLength = function () {
        	// Warning: when ng-include onload event is triggered the new layout has been loaded.
        	// But in case the layout directive is displayed in an Angular view,
        	// at this point the ng-include scope contains both previous and new layouts !
        	// For this reason, we have to select only the new layout which is the :first one (tested using ui-route)
        	scope.containersLength = element.find('.avn-dashboard-layout-content:first [avn-dashboard-container]').length;
        };

      	// After all the containers have registered themselves in the layout scope,
				// organize all widgets instances in the layout
        scope.init = function () {
          var defaultContainer = (scope.containers.filter(function (container) {
            return 'main' == container.name;
          }) || scope.containers)[0];

        	// The following .addWidget() method works on the scope.instances object, which must be now emptied.
					// For this reason, we have to work on a copy of this object.
          var _instances = jQuery.extend({}, scope.instances);
          scope.instances = {};

          for (var containerName in _instances) {
          	// Verify that the expected container is available in the layout,
						// Otherwise, fall back into the default container
            var container = scope.containers.filter(function (container) {
              return containerName == container.name;
            })[0] || defaultContainer;
						// Add each widget in its container (if still available)
            _instances[containerName].forEach(function (widget) {
            	scope.addWidget(container, widget);
            });
          }
        };
				// Add a widget in a container (all parameter are optionals)
        scope.addWidget = function (container, widget) {
        	// Match widget in the list of widgets
        	var widgetIndex = getWidgetIndex(widget);
        	if (undefined === widgetIndex) {
        		return addMessage('Your widget "' + widget.title + '" is no more available.');
        	} else if (scope.widgets[widgetIndex].hidden) {
        		return;
        	}
          // Duplicate original widget object to make it an instance
        	widget = jQuery.extend({}, scope.widgets[widgetIndex]);
        	// A widget can be added multiple times in a container
					// Because of that we have to remove its unique Angular idenfifier
        	delete widget.$$hashKey;
        	// Create or retrieve the container object from its name
          var list = scope.instances[container.name] = scope.instances[container.name] || [],
              lastIndex = list.length;
          // Add widget instance details
          widget.index = lastIndex;
          widget.containerName = container.name;
          list.push(widget);
        	// Each widget should know its relative position :
        	// first one have a widget.index = 0
          // last one have widget.index = widget.lastIndex
          list.forEach(function (widget) { widget.lastIndex = lastIndex; });
        	// Remove widget from list ?
          if (!widget.multiple) scope.widgets[widgetIndex].hidden = true;
        };

      	// Retore hidden widget in the list of widgets when it has been removed from a container
        scope.$on('avnDashboardContainerWidgetRemoved', function (e, widget) {
        	var scopeWidget = scope.widgets[getWidgetIndex(widget)];
        	if (scopeWidget.hidden) delete scopeWidget.hidden;
        });

        // Add and remove messages
        function addMessage(message) {
        	// Prevent Angular error "Duplicates in a repeater are not allowed."
        	if (-1 === scope.messages.indexOf(message)) scope.messages.push(message);
        }
        scope.removeMessages = function () {
        	scope.messages = [];
        };

        // Get the layout index from layout signature which is the 'layoutFile' (if available)
        function getLayoutIndex(layoutFile) {
          for (var i = 0; i < scope.layouts.length; i++)
          	if (scope.layouts[i].file == layoutFile) return i; // Warning: might return 0 !
        }
      	// Get the widget index from widget signature which is the widget 'type' and 'params' (if available)
        function getWidgetIndex(widget) {
        	for (var i = 0; i < scope.widgets.length; i++) {
        		if (
							scope.widgets[i].type == widget.type &&
							JSON.stringify(scope.widgets[i].params) == JSON.stringify(widget.params)
						) return i; // Warning: might return 0 !
          }
        }
      },

      templateUrl: PATH + 'template/layout.html',

      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

				// Each container have to register itself in the layout scope
        this.registerContainer = function (container) {
        	$scope.containers.push(container);
          if ($scope.containers.length == $scope.containersLength) $scope.init();
        };

      	// Each container can request a widget to be added
        this.addWidget = function (containerName, widgetIndex) {
					// Retrieve the container from its name
        	var container = $scope.containers.filter(function (container) {
        		return containerName == container.name;
        	})[0];
        	$scope.addWidget(container, $scope.widgets[widgetIndex]);
        };

      }]

    };
  }])

	// A simple directive that display a drop down list and allow the user to select layout, container and widget...
	// To handle the selection, use a $watch in the parent directive
  .directive('avnDashboardSelect',
  ['avn.dashboard.PATH',
  function (PATH) {

    return {

      restrict: 'E',

      replace: true,

      scope: {
        title: '@', // Drop down title
        items: '=', // JSON of items
        defaultIndex: '=', // Default selection
        prop: '@', // The item property to use as label in the UI
        hideProp: '@', // The item property used as boolean to hide items
        css: '@', // Css class added to the selected label in the UI
				event: '@' // The Angular event triggered on selection
      },

      link: function (scope, element, attrs) {
      	// Default prop, hideProp and css values
        scope.prop = scope.prop || 'title';
        scope.hideProp = scope.hideProp || 'hidden';
        scope.css = scope.css || 'avn-dashboard-select-active';
        scope.event = scope.event || 'avnDashboardSelect';
      	// Set the selected index
        scope.set = function (index) {
        	scope.$emit(scope.event, scope.index = index);
        };
				// Prevent hash tag modification
        element.on('click', function (e) { e.preventDefault(); });
				// Set default index
        undefined === scope.defaultIndex || scope.set(scope.defaultIndex);
      },

      templateUrl: PATH + 'template/select.html'

    }

  }]);

})();
