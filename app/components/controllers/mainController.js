
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['$scope','PublishService', 'FileFactory', 'DiskFactory', 'IpfsService', mainController]);

function mainController($scope, PublishService, FileFactory, DiskFactory, IpfsService) {
  //load publish object when switching to publish page
  const self = this;
  self.view = 'files';
  PublishService.init()
  IpfsService.init();
  DiskFactory.init();
  FileFactory.init();
  self.daemonStatus = function (){
    return self.daemonLoaded()
  }
  self.daemonLoaded = IpfsService.daemonLoaded;
  self.publishpage = function () {
  }
}

