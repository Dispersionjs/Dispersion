
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['PublishService', 'FileFactory', 'DiskFactory', 'IpfsService', mainController]);

function mainController(PublishService, FileFactory, DiskFactory, IpfsService) {
  //load publish object when switching to publish page
  const self = this;
  self.view = 'files';
  PublishService.init()
  IpfsService.init();
  DiskFactory.init();
  FileFactory.init()
  self.publishpage = function () {
  }
}

