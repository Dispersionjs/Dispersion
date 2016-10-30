angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('PublishController', ['PublishService', 'IpfsService', 'DiskFactory', 'ProjectService', PublishController]);

function PublishController(PublishService, IpfsService, DiskFactory, ProjectService) {
  // PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;
  self.currentlyPublished = PublishService.currentlyPublished;
  self.setAsPublished = PublishService.setPublished;
  self.isPublished = function (projectName) {
    return self.currentlyPublished() === projectName;
  }
  self.setProjectView = function (projectName) {
    console.log('setting project view for: ', projectName)
    ProjectService.changeSelectedProject(projectName)
  }

  // self.addPubDataOnEdit = function (pubObj, projectName) {
  //   console.log('when clicked edit, adding this to published:', pubObj)
  //   pubObj[0].publish = true;
  //   PublishService.unshiftForEditFix(pubObj[0], projectName)
  //   ProjectService.changeSelectedProject(projectName)
  // }



  self.publishToIpfs = function (value, name) {
    console.log('value, name in publish to ipfs called from publish controller', value, name)
    // self.publishedProjectCard = name;
    self.setAsPublished(name);
    ProjectService.changeSelectedProject(name);
    IpfsService.publish(value, name)
    // PublishService.add(value, true, name);
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

