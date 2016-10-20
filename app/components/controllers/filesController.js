
angular
  .module('FilesController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('FilesController', ['$scope', '$q', '$timeout', 'FileFactory', 'PublishService', 'DiskFactory', 'IpfsService', FilesController]);

function FilesController($scope, $q, $timeout, FileFactory, PublishService, DiskFactory, IpfsService) {
  const self = this;

  //get Username of local user. Used for file saving
  username().then(username => {
    self.username = username;
  });

  self.files = FileFactory.data;

  //shows additional info about pinned file
  self.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  self.addHash = function () {
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (addFiles) {
      IpfsService.addFile(addFiles[0]);
      $timeout(() => {
        FileFactory.loadFilesFromStorage()
      }, 1000)
    });
  }

  self.deleteHash = function (hash) {
    IpfsService.unPin(hash);
    self.files = FileFactory.loadFilesFromStorage()
  }

  self.saveToDisk = function (hash, username) {
    IpfsService.saveToDisk(hash, username);
  }

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



  /*********************************************************/
  var publishObjectPromise = new Promise(function (resolve, reject) {
    storage.get('publishStorage', function (error, data) {
      if (error) throw error;
      else resolve(data);
    })
  });

  publishObjectPromise.then(function (data) {
    console.log('data',data);
    self.publishObject = data;
  })

  self.publisher = function (hash) {
    console.log(hash)
    IpfsService.publish(hash)
  }

  // DiskFactory.init();  
  //Add project from local file system to electron app system
  // $scope.addProject = FileFactory.copyProject();

}