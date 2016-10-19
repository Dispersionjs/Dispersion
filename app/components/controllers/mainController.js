
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['PublishService', mainController]);

function mainController(PublishService) {
  //load publish object when switching to publish page
  const self = this;
  self.view = 'files';
  PublishService.init()
  self.publishpage = function () {
  }
}
