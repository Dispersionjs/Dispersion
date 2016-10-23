angular.module('myApp', ['ui.ace', 'ProjectService', 'ProjectController', 'FileHistoryDirective', 'FileHistoryController', 'FileHistoryFactory'])
  .config(['$sceProvider', function ($sceProvider) {
    $sceProvider.enabled(false);
  }])