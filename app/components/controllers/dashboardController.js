/**
 * Main goes here
 */
 //declaring the about module and controller
angular
    .module('DashboardController', [])
    //passing $scope and UserFactory as dependencies to controller
    .controller('DashboardController',['$scope','$q','$timeout','HashFactory', DashboardController]);

function DashboardController($scope, $q, $timeout, HashFactory) {
    //start local Daemon
    Dispersion.startDaemon()
    //get Username of local user. Used for file saving
    username().then(username => {
      $scope.username = username;
    });
    $scope.newFile;

    //gets all of the users pinned hashes
    HashFactory.loadFilesFromStorage($scope);

    //shows additional info about pinned file
    $scope.showInfo = function (index) {
      $(`#sel-option${index}`).show();
    }

    //function in renderer.js that adds file or directory to local ipfs node
    $scope.addHash = function () {
      Dispersion.submitFile($scope.newFile);
      $timeout(() => {
        $scope.files = HashFactory.loadFilesFromStorage($scope)
      }, 1000)
    }

    $scope.deleteHash = function (hash) {
      Dispersion.unPin(hash);
      $scope.files = HashFactory.loadFilesFromStorage($scope)
    }

    $scope.saveToDisk = function (hash, username) {
      Dispersion.saveToDisk(hash, username);
    }

    $scope.addToPublish = function (value) {
      console.log(HashFactory.addToPublish(value))
      HashFactory.addToPublish(value).then(function () {
        console.log('new project has been published')
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
        else { console.log('made directory at', __dirname)}
      });

      /**TODO: Currently when you copy a directory with fse it will copy the contents of the directory
       *but not the folder name. In a hacky way I rebuild the foldername. Could be better"**/      
      let folderDepthArr = $scope.projectDir.split('/'); 
      let folderName = '/' + folderDepthArr[folderDepthArr.length-1]

      fse.copy($scope.projectDir, path.resolve(__dirname + `/../projectFolder` + folderName), (err) => {
        if (err) return console.error(err);
        console.log('copied folder')
      })
    }




    //UNCOMMENT FOR INITIAL DUMMY DATA
    // var dummyData = {"QmbyNmx4uWiSjf3oPUXJLBJzRroMeTqgsPopkWLpf9j33C": {"file":"upload/cats/cat-oxygen-mask.jpg",
    //   "time":"Tue, 11 Oct 2016 18:38:59 GMT",
    //   "url":"https://ipfs.io/ipfs/QmbyNmx4uWiSjf3oPUXJLBJzRroMeTqgsPopkWLpf9j33C"
    // },
    // "QmRHuKfHdVGtdLyJxpazf2dVd4GqNjgQbE7aAjiDEAd1tR": {"file":"upload/cliftons.jpg","time":"Tue, 11 Oct 2016 18:38:59 GMT","url":"https://ipfs.io/ipfs/QmRHuKfHdVGtdLyJxpazf2dVd4GqNjgQbE7aAjiDEAd1tR"},
    // "QmbGuztCs9DKnSAhzVGarunty9AdwejCi5Kb4JQ4JfT6vu": {"file":"upload/pdfs/part_1_-_6_object_oriented_javascript_part_2__keyword__this__.pdf","time":"Tue, 11 Oct 2016 18:38:59 GMT","url":"https://ipfs.io/ipfs/QmbGuztCs9DKnSAhzVGarunty9AdwejCi5Kb4JQ4JfT6vu"}
    // };
    // storage.set('publishStorage', dummyData, function(error){
    // if (error) throw error;
    // console.log("storage saved")
    // })

  }