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
  self.files = getFileData()
  self.updateFiles = function () {
    return FileFactory.data.map((hashObj, arrayIndex) => {
      let hash, file, date, url, files, index, data;
      hash = Object.keys(hashObj)[0];
      data = hashObj[hash]
      file = data.file;
      date = data.date;
      url = data.url;
      files = data.files;
      index = arrayIndex;
      return { hash, file, date, url, files, index }
    });
  }
  self.files = self.updateFiles()

  //shows additional info about pinned file
  self.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  self.addHash = FileFactory.addHash;

  self.deleteHash = function (hash) {
    console.log('titties')
    IpfsService.unPin(hash).then(() => {
      FileFactory.init();
    });
  }

  self.addToPublish = function (value) {
    PublishService.add({
      [value.file]: [{
        'date': value.time,
        'hash': value.hash,
        'publish': false,
        'changed': null,
        'url': value.url,
        'files': value.files
      }]
    });
  }
}