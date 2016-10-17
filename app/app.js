const app = angular.module('myApp', ['directives', 'HashFactory','PublishService'])

  .controller('DashboardController', function ($scope, $q, $timeout, HashFactory) {
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




    /*********************************************************/
    var publishObjectPromise = new Promise(function (resolve, reject) {
      storage.get('publishStorage', function (error, data) {
        if (error) throw error;
        else resolve(data);
      })
    });

    publishObjectPromise.then(function(data){
      console.log(data);
      $scope.publishObject = data;
    })
    console.log("Instant Log: " + $scope.publishArray);

    $scope.publisher = function (hash) {
      console.log(hash)
      Dispersion.publishHash(hash)
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

  })
  
  .controller('PublishController', function ($scope, $q, $timeout, HashFactory) {



  })
  ;
