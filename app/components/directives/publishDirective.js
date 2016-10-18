angular.module('publishDirective', [])


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