
angular
    .module('MainController', [])
    //passing $scope and UserFactory as dependencies to controller
    .controller('MainController',['$scope', 'PublishService', MainController]);

function MainController($scope, PublishService) {
   //load publish object when switching to publish page
    $scope.publishpage = function () {
    PublishService.loadPublished().then(function (resolve) {
      $scope.publishedFiles = resolve;
      console.log('resolve', resolve)
    })
    }
 }
