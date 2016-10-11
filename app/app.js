const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function($scope, $q, $timeout, HashFactory) {

    //gets all of the users pinned hashes
    HashFactory.init().then(function(fileArray) {
      $scope.files = HashFactory.fileget(fileArray);
    });

    //shows additional info about pinned file
    $scope.showInfo = function(index) {
      $(`#sel-option${index}`).show();
    }

    $scope.newFile;
    $scope.addHash = function() {
      //function in renderer.js that adds file or directory to local ipfs node
      submitFile($scope.newFile);

      $timeout(function() {
        console.log("just entered", $scope.files);
        HashFactory.init().then(function(fileArray) {
          console.log(fileArray)
          $scope.files = HashFactory.fileget(fileArray);
          window.location.reload()
        })
      }, 1000);
    }

    $scope.deleteHash = function(hash) {
      unPin(hash);
      window.location.reload()
    }

  })


//   function submitFile(filepath) {
//   //file to be hashed. add quotes to ignore possible spaces
//   let hashFile = filepath
//   if (hashFile.includes('/')) hashFile = `"${hashFile}"`;

//   // recursively hashes directory or file and adds to ipfs
//   let command = `ipfs add -r ${hashFile}`;

//   //If it is a directory, then add a wrapper hash.
//   if (!hashFile.includes('.')) {
//     command = `${command} -w`;
//   }
//   //hashes and adds file or directory to local ipfs node
//   addDirectory(hashFile, command)
// }
// /////***********************
// function addDirectory(filePath, hashType) {
//   //escape spaces in foldername
//   exec(hashType, function(error, stdout, stderr) {

//     //grabs just the filename from the absolute path of the added file
//     let fileLocationArray = filePath.split('/');
//     let file = fileLocationArray[fileLocationArray.length - 1];
//     let hashArray = stdout.trim().split('\n');

//     hashArray.forEach(function(item) {
//       let hashObject = makeHashObject(item);
//       requestHashObject(hashObject);

//     })

//     //refresh hash list
//     hashList();
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
//   })
// }