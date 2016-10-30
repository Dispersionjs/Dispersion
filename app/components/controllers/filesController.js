angular
  .module('FilesController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('FilesController', ['FileFactory', 'PublishService', 'DiskFactory', 'IpfsService', 'FileHistoryFactory', FilesController]);

function FilesController(FileFactory, PublishService, DiskFactory, IpfsService, FileHistoryFactory) {

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
  self.formatDate = function (date) {
    let dateOut = new Date(date);
    return dateOut;
  };

  self.deleteHash = function (hash, index) {
    Materialize.toast("File Deleted!", 3000);
    IpfsService.unPin(hash);
    FileFactory.removeFile(index);
  }

  self.addToPublish = function (value) {
    Materialize.toast("Staged for Publish!", 3000);
    console.log('in add to publish, value: ', value);
    DiskFactory.addProject(value.pathToFile);
    PublishService.add({
      [value.file]: [{
        'date': value.date,
        'hash': value.hash,
        'publish': true,
        'changed': null,
        'url': value.url,
        'files': value.files
      }]
    });
    //initial add of all files to FileVersionHistory
    FileHistoryFactory.initialAdd(value.date, value.url, value.hash, value.files, value.file);

    // date, url, hash, filesArray, projectName

  }

  self.getIframeUrl = function (fileObj, fileName) {
    return fileObj + fileName;
  }

}