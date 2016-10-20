angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('PublishController', ['PublishService', 'DiskFactory', PublishController]);

function PublishController(PublishService, DiskFactory) {
  PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;
  
  // self.addProject = function (projectDir) {
  //   DiskFactory.addProject(projectDir);
  // }
  self.addProject = DiskFactory.addProject;
  self.overwrite = DiskFactory.overwrite;
  self.delete = DiskFactory.delete;

}