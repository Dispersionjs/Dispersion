const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function ($scope, $q, HashFactory) {
    
    $scope.newFile;

    //gets all of the users pinned hashes
    HashFactory.getFiles($scope)

    //shows additional info about pinned file
    $scope.showInfo = function (index) {
      $(`#sel-option${index}`).show();
    }

    //function in renderer.js that adds file or directory to local ipfs node
    $scope.addHash = function () {
      submitFile($scope.newFile);
      $scope.files = HashFactory.getFiles($scope)
    }

    $scope.deleteHash = function (hash) {
      unPin(hash);
      $scope.files = HashFactory.getFiles($scope)
      window.location.reload()
    }
  });