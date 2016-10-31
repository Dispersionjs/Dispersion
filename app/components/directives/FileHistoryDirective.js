
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
      // link: function (scope) {
      // scope.updateEditorContent();
      // scope.recordIndex();
      // scope.toggleShowInfo();
      // },
      controller: 'FileHistoryController',
      templateUrl: 'components/partials/FileHistoryPartial.html',
      replace: true
    };
  })