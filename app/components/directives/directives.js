angular.module('directives', [])

.directive('topBar', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      templateUrl: 'components/partials/topbar.html',
      replace: true
    };
  })
  .directive('hashForm', function() {
    return {
      restrict: 'E',
      controller: 'DashboardController',
      transclude: true,
      scope: {},
      templateUrl: 'components/partials/addHashForm.html',
      replace: true
    };
  })
