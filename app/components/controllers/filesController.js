angular
  .module('FilesController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('FilesController', ['FileFactory', 'PublishService', 'DiskFactory', 'IpfsService', FilesController]);

function FilesController(FileFactory, PublishService, DiskFactory, IpfsService) {

  const self = this;
  self.sortBy = 'time';
  //get Username of local user. Used for file saving
  username().then(username => {
    self.username = username;
  });
  self.files = FileFactory.data;
  self.getFileData = FileFactory.getFileData
  //shows additional info about pinned file
  self.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  self.addHash = FileFactory.addHash;

  self.deleteHash = function (hash,index) {
    IpfsService.unPin(hash);
    FileFactory.removeFile(index);
  }

  self.addToPublish = function (value) {
    Materialize.toast("Staged for Publish!",3000);
    PublishService.add({
      [value.file]: [{
        'date': value.date,
        'hash': value.hash,
        'publish': false,
        'changed': null,
        'url': value.url,
        'files': value.files
      }]
    });
  }

  self.getIframeUrl = function(fileObj,fileName) {
    return fileObj + fileName;
  }

}