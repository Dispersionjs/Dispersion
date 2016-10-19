angular.module('projectDirective', [])

.directive('projectAddBar', function() {
 return {
   restrict: 'E',
   transclude: true,
   controller: 'AddFilesController',
   scope: false,
   templateUrl: 'components/partials/project-add-bar.html',
   replace: true
 };
})