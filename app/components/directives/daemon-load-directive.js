angular.module('daemonDirective', [])

.directive('daemonLoad', function() {
 return {
   restrict: 'E',
   transclude: true,
   scope: false,
   templateUrl: 'components/partials/daemon-load.html',
   replace: true
 };
})