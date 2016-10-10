const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function($scope, $q, HashFactory) {

    //gets all of the users pinned hashes
    $scope.files;
    HashFactory.then(function(fileArray) {
      $scope.files = fileget(fileArray);
    });

    //shows additional info about pinned file
    $scope.showInfo = function(index) {
      $(`#sel-option${index}`).show();
    }

    $scope.newFile;
    $scope.addHash = function() {
      submitFile($scope.newFile);
      //needs promise in order to execute this after new file is added
      HashFactory.then(function(fileArray) {
        $scope.files = fileget(fileArray);
      });
    }

    $scope.deleteHash = function(hash) {
      console.log(hash)
    }


  })

// http://jsfiddle.net/Tpf7E/22/
