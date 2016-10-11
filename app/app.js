const app = angular.module('myApp', ['directives', 'HashFactory'])
  .controller('DashboardController', function($scope, $q, $timeout, HashFactory) {

    //gets all of the users pinned hashes
    HashFactory.getFiles($scope)

    // $q.all(x).then(function(fileArray))
    // // $scope.files =

    //shows additional info about pinned file
    $scope.showInfo = function(index) {
      $(`#sel-option${index}`).show();
    }


    $scope.newFile;
    //function in renderer.js that adds file or directory to local ipfs node
    $scope.addHash = function() {


      //Add new file to IPFS and
      submitFile($scope.newFile);
      $scope.files = HashFactory.getFiles()
    }

    $scope.deleteHash = function(hash) {
      unPin(hash);
      window.location.reload()
    }



    //   function getFiles() {
    //     storage.keys(function (error, keys) {
    //       if (error) throw error;
    //       console.log('storage.keys', keys)

    //       var promiseArr = [];
    //       var fileArray = [];

    //       //make promise array
    //       keys.forEach((key, index, array) => {
    //         promiseArr.push(
    //           $q((resolve, reject) => {
    //             storage.get(key, (error, data) => {
    //               console.log("storage.get key from promise array", key)
    //               if (/Qm/.test(key)) {
    //                 fileArray.push({ [key]: data })
    //               }
    //               resolve();
    //             })
    //           }))
    //       })
    //       $q.all(promiseArr).then(function () {
    //         $scope.files = fileget(fileArray);
    //       })
    //     })
    //   }


    //   function fileget(fileArray) {
    //     let arr = [];
    //     let type;
    //     fileArray.forEach(function (item, index) {
    //       //finds file type
    //       type = testFileType(item);
    //       arr.push({
    //         item: item[Object.keys(item)].file,
    //         time: item[Object.keys(item)].time,
    //         url: item[Object.keys(item)].url,
    //         fileType: type,
    //         hash: Object.keys(item)[0]
    //       })
    //     })
    //     return arr;
    //   }


    // function testFileType(item) {
    //   let fileName = item[Object.keys(item)].file
    //   if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.PNG') || fileName.includes('.jpeg')) {
    //     return 'image';
    //   } else if (!fileName.includes('.')) {
    //     return 'folder';
    //   } else if (fileName.includes('.xl')) {
    //     return 'excel';
    //   } else if (fileName.includes('.pdf') || fileName.includes('.txt') || fileName.includes('.doc')) {
    //     return 'doc';
    //   }
    // }


  })
