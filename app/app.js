angular.module('myApp', [
  'topbarDirective',
  'publishDirective',
  'projectDirective',
  'daemonDirective',
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

