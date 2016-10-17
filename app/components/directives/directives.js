angular.module('directives', [])

.directive('topBar', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'DashboardController',
    scope: false,
    templateUrl: 'components/partials/topbar.html',
    replace: true
  };
})
.directive('publishCard', function() {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'PublishController',
    scope: false,
    templateUrl: 'components/partials/publishCard.html',
    replace: true
  };
})
