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
  })

// http://jsfiddle.net/Tpf7E/22/
