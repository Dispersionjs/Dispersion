angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('PublishController', ['PublishService', 'IpfsService', 'DiskFactory', PublishController]);

function PublishController(PublishService, IpfsService, DiskFactory) {
  // PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;
  self.publishedProjectCard = '';
  self.updatePublishedStatus = function () {
    self.publishedProjectCard = PublishService.currentlyPublished();
  }
  self.publishToIpfs = function (value, name) {
    // self.publishedProjectCard = name;
    IpfsService.publish(value, name)
  }

  // self.activeButton = function (value) {
  //   console.log('value passed to active button', value);
  //   console.log('self.data: ', self.data);
  //   self.currentlyPublished = value;
  //   for (let key in self.data) {
  //     if (self.data[key].toggled && self.data[key] !== value) {
  //       self.data[key].toggled = false
  //     }
  //   }
  //   value.toggled = !value.toggled;
  // }
  // self.addProject = DiskFactory.addProject;
  // self.overwrite = DiskFactory.overwrite;
  // self.delete = DiskFactory.delete;

}

