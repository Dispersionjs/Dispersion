const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function ($scope, $q, $timeout, HashFactory) {

    //gets all of the users pinned hashes
    $scope.files;
    HashFactory.init().then(function (fileArray) {
      $scope.files = HashFactory.fileget(fileArray);
    });

    //shows additional info about pinned file
    $scope.showInfo = function (index) {
      $(`#sel-option${index}`).show();
    }

    $scope.newFile;
    $scope.addHash = function () {
      submitFile($scope.newFile);

      //needs promise in order to execute this after new file is added

      
      $timeout(function () {
        console.log("just entered", $scope.files);
        HashFactory.init().then(function (fileArray) {
              console.log(fileArray)
              $scope.files = HashFactory.fileget(fileArray);
          console.log("now scope files is set", $scope.files);
       })
      }, 5000);
    }


    $scope.deleteHash = function (hash) {
      //console.log(hash)
      unPin(hash);
    }


  })

// http://jsfiddle.net/Tpf7E/22/
