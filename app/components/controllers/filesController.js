
angular
  .module('FilesController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('FilesController', ['$scope', 'FileFactory', 'PublishService', 'DiskFactory', 'IpfsService', FilesController]);

function FilesController($scope,FileFactory, PublishService, DiskFactory, IpfsService) {

  const self = this;
  self.sortBy = 'time';
  //get Username of local user. Used for file saving
  username().then(username => {
    self.username = username;
  });

  self.files = FileFactory.data;

  //shows additional info about pinned file
  self.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  self.addHash = FileFactory.addHash;

  self.deleteHash = function (hash) {
    IpfsService.unPin(hash);
    self.files = FileFactory.loadFilesFromStorage()
  }
  // self.deleteHash = IpfsService.unPin

  self.saveToDisk = IpfsService.saveToDisk;

  self.addToPublish = function (value) {
    PublishService.add(
      {
        [value.item]:
        [
          {
            'date': value.time,
            'hash': value.hash,
            'publish': false,
            'changed': null,
            'url': value.url,
            'files': value.files
          }
        ]
      });
  }
}