const childProcess = require('child_process');
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const storage = require('electron-json-storage');
const fs = require('fs');
const readChunk = require('read-chunk'); // npm install read-chunk
const fileType = require('file-type');
const https = require('https');
const request = require('request');
const username = require('username');
const fse = require('fs-extra');
const path = require('path');
const {dialog} = require('electron').remote;

angular.module('myApp', [
  'topbarDirective',
  'publishDirective',
  'daemonDirective',
  'settingsDirective',
  'FileFactory',
  'PublishService',
  'MainController',
  'DiskFactory',
  'IpfsService',
  'FilesController',
  'PublishController',
  'SettingsController',
  'ui.ace',
  'ProjectService',
  'ProjectController',
  'FileHistoryDirective',
  'FileHistoryController',
  'FileHistoryFactory',
  'ui.materialize'
])
  .config(['$sceProvider', function ($sceProvider) {
    $sceProvider.enabled(false);
  }])
  .controller('ViewController', [viewController])
function viewController() {
  const self = this;
  self.view = 'loading';
  self.changeView = function (view) {
    self.view = view;
  }
}

