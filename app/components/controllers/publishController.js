angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('PublishController', ['PublishService','IpfsService', PublishController]);

function PublishController(PublishService, IpfsService) {
  PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;

  self.publishToIpfs = IpfsService.publish

}