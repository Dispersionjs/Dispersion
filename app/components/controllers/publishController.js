angular
    .module('PublishController', [])
    //passing $scope and UserFactory as dependencies to controller
    .controller('PublishController',['$scope', 'PublishService', PublishController]);

function PublishController($scope, PublishService) {

  }