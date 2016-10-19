angular
  .module('PublishController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('PublishController', ['PublishService', PublishController]);

function PublishController(PublishService) {
  PublishService.init().then(console.log('init called in publish controller'))
  const self = this;
  self.data = PublishService.data;
  self.show = function () {
    console.log('self:\n', self, 'self.data:\n', self.data, 'publishService: \n', PublishService);
  }
  console.log('self.data in publish controller: \n', self.data);
}