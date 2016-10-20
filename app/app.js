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

