angular.module('myApp', [
  'topbarDirective',
  'publishDirective',
  'projectDirective',
  'FileFactory',
  'PublishService',
  'MainController',
  'DiskFactory',
  'IpfsService',
  'FilesController',
  'PublishController'])
  .config(['$sceProvider', function ($sceProvider) {
   $sceProvider.enabled(false);
 }])

