
angular.module('FileHistoryDirective', ['FileHistoryController'])

  .directive('fileHistory', function () {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        index: '@',
        filename: '@',
        projectname: '@',
        projectobject: '@',
        mode: '@'
      },
      controller: 'FileHistoryController',
      templateUrl: 'components/partials/FileHistoryPartial.html',
      replace: true
    };
  })