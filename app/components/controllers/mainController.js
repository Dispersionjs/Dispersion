
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['PublishService', 'FileFactory', 'IpfsService', mainController]);

function mainController(PublishService, FileFactory, IpfsService) {
  //load publish object when switching to publish page
  const self = this;
  self.view = 'files';
  PublishService.init()
  IpfsService.init();
  FileFactory.init();  
  self.publishpage = function () {
  }
}
