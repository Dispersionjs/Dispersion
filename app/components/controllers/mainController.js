
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['$scope','PublishService', 'FileFactory', 'DiskFactory', 'IpfsService', mainController]);

function mainController($scope, PublishService, FileFactory, DiskFactory, IpfsService) {
  //load publish object when switching to publish page
  const self = this;
  self.view = 'files';
  PublishService.init()
  IpfsService.init().then((data) => {
    console.log('daemondata',data)
    self.daemonStatus = data;
  });
  DiskFactory.init();
  FileFactory.init();
  self.publishpage = function () {
  }
}

