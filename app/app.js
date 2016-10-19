angular.module('myApp', [
  'topbarDirective',
  'publishDirective',
  'projectDirective',
  'HashFactory',
  'PublishService',
  'MainController',
  'DashboardController',
  'PublishController'])
  .config(['$sceProvider', function ($sceProvider) {
   $sceProvider.enabled(false);
 }])

