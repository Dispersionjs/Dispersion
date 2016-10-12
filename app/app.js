const app = angular.module('myApp', ['directives', 'HashFactory'])

.controller('DashboardController', function($scope, $q, $timeout, HashFactory) {
  //start local Daemon
  Dispersion.startDaemon()

  //get Username of local user. Used for file saving
  username().then(username => {
    $scope.username = username;
  });

  $scope.newFile;

  //gets all of the users pinned hashes
  HashFactory.loadFilesFromStorage($scope);

  //shows additional info about pinned file
  $scope.showInfo = function(index) {
    $(`#sel-option${index}`).show();
  }

  //function in renderer.js that adds file or directory to local ipfs node
  $scope.addHash = function() {

    Dispersion.submitFile($scope.newFile);

    $timeout(() => {
      $scope.files = HashFactory.loadFilesFromStorage($scope)
    }, 1000)

  }

  $scope.deleteHash = function(hash) {
    Dispersion.unPin(hash);
    $scope.files = HashFactory.loadFilesFromStorage($scope)
  }

  $scope.saveToDisk = function(hash, username) {
    Dispersion.saveToDisk(hash, username);
  }

});
