angular.module('myApp', [
  'topbarDirective',
  'publishDirective',
  'projectDirective',
  'HashFactory',
  'PublishService',
  'MainController',
  'FileFactory',
  'IpfsService',
  'FilesController',
  'PublishController'])
  .config(['$sceProvider', function ($sceProvider) {
   $sceProvider.enabled(false);
 }])

