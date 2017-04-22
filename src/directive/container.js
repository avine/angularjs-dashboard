(function () {
  "use strict";

	// Add a container somewhere in the layout that will contains associated widgets instances
	//
	// <div crm-dashboard-container
  //		data-list="widgets"
	//		data-instance="instances.[CONTAINER_NAME]"></div>
	//
  angular.module('crm.dashboard').directive('crmDashboardContainer',
  ['crm.dashboard.PATH', '$rootScope', '$compile',
  function (PATH, $rootScope, $compile) {
    return {

      restrict: 'A',

      require: '^crmDashboardLayout',

      replace: false,

      scope: {
      	list: '=', // List of available widgets inherited from the layout scope
      	instance: '=' // Widgets instance of the container inherited from the layout scope
      },

      link: function (scope, element, attrs, layoutCtrl) {
      	// Introspect the container name from the element attribute instance="instances.[CONTAINER_NAME]"
      	var containerName = attrs.instance.split('.')[1];

      	// Handle widget selection
      	scope.$on('selectWidgetIndex', function (e, index) {
      		e.preventDefault();
      		layoutCtrl.addWidget(containerName, index);
      	});

        // Each container should register itself in the layout scope
        layoutCtrl.registerContainer({
          element: element,
          name: containerName
        });
      },

      templateUrl: PATH + 'template/container.html',

      controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {

        this.removeWidget = function (index) {
        	var removed = $scope.instance.splice(index, 1)[0],
						lastIndex = $scope.instance.length - 1;
        	$scope.instance.forEach(function (widget, i) {
            widget.index = i;
            widget.lastIndex = lastIndex;
        	});
        	$scope.$emit('crmDashboardContainerWidgetRemoved', {
        		type: removed.type, params: removed.params
        	});
        };

        this.moveDownWidget = function (index) {
        	$scope.instance.splice(index + 1, 0, $scope.instance.splice(index, 1)[0]);
        	$scope.instance.forEach(function (widget, i) { widget.index = i; });
        };

        this.moveUpWidget = function (index) {
        	$scope.instance.splice(index - 1, 0, $scope.instance.splice(index, 1)[0]);
          $scope.instance.forEach(function (widget, i) { widget.index = i; });
        };

      }]

    };
  }]);

})();
