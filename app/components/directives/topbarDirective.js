angular.module('topbarDirective', [])

.directive('topBar', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'AddFilesController',
    scope: false,
    templateUrl: 'components/partials/topbar.html',
    replace: true
  };
})
