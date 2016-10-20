angular.module('daemonDirective', ['MainController'])

.directive('daemonLoad', function() {
 return {
   restrict: 'E',
   transclude: true,
   controller: 'MainController',
   controllerAs: 'mainCtrl',
   scope: false,
   templateUrl: 'components/partials/daemon-load.html',
   replace: true
 };
})