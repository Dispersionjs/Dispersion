angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('PublishController', ['PublishService', 'IpfsService', 'DiskFactory', PublishController]);

function PublishController(PublishService, IpfsService, DiskFactory) {
  PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;

  self.publishToIpfs = IpfsService.publish
  // self.addProject = DiskFactory.addProject;
  // self.overwrite = DiskFactory.overwrite;
  // self.delete = DiskFactory.delete;

}