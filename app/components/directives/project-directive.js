angular.module('projectDirective', [])

  .directive('projectAddBar', function () {
    return {
      restrict: 'E',
      transclude: true,
      controller: 'PublishController',
      controllerAs: 'pubCtrl',

      templateUrl: 'components/partials/project-add-bar.html',
      replace: true
    }
  })