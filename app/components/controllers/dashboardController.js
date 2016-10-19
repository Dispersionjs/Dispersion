/**
 * Main goes here
 */
//declaring the about module and controller
angular
  .module('DashboardController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('DashboardController', ['$scope', '$q', '$timeout', 'HashFactory', 'PublishService', DashboardController]);

function DashboardController($scope, $q, $timeout, HashFactory, PublishService) {
  //start local Daemon
  Dispersion.startDaemon()
  //get Username of local user. Used for file saving
  username().then(username => {
    $scope.username = username;
  });
  $scope.files;
  //gets all of the users pinned hashes
  HashFactory.loadFilesFromStorage($scope);

  //shows additional info about pinned file
  $scope.showInfo = function (index) {
    $(`#sel-option${index}`).show();
  }

  $scope.addHash = function () {
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (addFiles) {
      Dispersion.submitFile(addFiles[0]);
      $timeout(() => {
        $scope.files = HashFactory.loadFilesFromStorage($scope)
      }, 1000)
    });
  }

  $scope.deleteHash = function (hash) {
    Dispersion.unPin(hash);
    $scope.files = HashFactory.loadFilesFromStorage($scope)
  }

  $scope.saveToDisk = function (hash, username) {
    Dispersion.saveToDisk(hash, username);
  }

  $scope.addToPublish = function (value) {
    console.log('value in add to publish: \n', value)
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
    console.log(data);
    $scope.publishObject = data;
  })
  console.log("Instant Log: " + $scope.publishArray);

  $scope.publisher = function (hash) {
    console.log(hash)
    Dispersion.publishHash(hash)
  }

  //Add project from local file system to electron app system
  $scope.addProject = function () {
    //Make folder for projects if it doesn't exist'
    console.log('prohj folder dir', path.resolve(__dirname + `/../projectFolder`))
    fse.mkdirsSync(path.resolve(__dirname + `/../projectFolder`), (err) => {
      if (err) return console.error(err);
      else { console.log('made directory at', __dirname) }
    });

    /**TODO: Currently when you copy a directory with fse it will copy the contents of the directory
     *but not the folder name. In a hacky way I rebuild the foldername. Could be better"**/
    let folderDepthArr = $scope.projectDir.split('/');
    let folderName = '/' + folderDepthArr[folderDepthArr.length - 1]

    fse.copy($scope.projectDir, path.resolve(__dirname + `/../projectFolder` + folderName), (err) => {
      if (err) return console.error(err);
      console.log('copied folder')
    })
  }

}