var module = angular
  .module('FileFactory', [])

module.service('FileFactory', ['$q', '$timeout', 'IpfsService', fileFactory]);

function fileFactory($q, $timeout, IpfsService) {
  let fileData = [];

  function addToFileData(hash, obj) {
    fileData.push({ [hash]: obj });
    storage.set('files', fileData, (error) => {
      if (error) {
        console.log('error in addFile to data in file Factory, the error is: \n');
        console.error(error);
      }
    })
  }
  function resaveFileData(hash, obj) {
    fileData.push({ [hash]: obj });
    storage.set('files', fileData, (error) => {
      if (error) {
        console.log('error in addFile to data in file Factory, the error is: \n');
        console.error(error);
      }
    })
  }
  function addHash() {
    // dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (addFiles) {
    //we are removing option for multi selection, please restore the above line if neccessary
    // IpfsService.addFile(addFiles[0]);
    // $timeout(() => {
    //   loadFilesFromStorage()
    // }, 1000)
    // });

    //convert to singular file add, if necessary
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (selected) {
      IpfsService.addFile(selected[0]).then((hashPair) => {
        let [folderHash, hashObjData] = hashPair;
        addToFileData(folderHash, hashObjData);
      });
      // $timeout(() => {
      //   loadFilesFromStorage()
      // }, 1000)
      // self.storeFile = function (hashPair) {
      //   let [folderHash, hashObjData] = hashPair;
      //   FileFactory.add(folderHash, hashObjData);
      // }
    });
  }

  function loadFilesFromStorage() {
    return $q((resolve, reject) => {
      storage.get('files', (error, data) => {
        console.log('files key in local storage', data)
        if (error) {
          console.error(error)
          reject()
        } else {
          for (let hash of Object.keys(data)) {
            console.log(hash)
            fileData.push({ [hash]: data[hash] })
          }
          resolve(fileData);
        }
      })
    })
    // console.log('inside files from storage')
    // storage.keys(function (error, keys) {
    //   if (error) throw error;
    //   var promiseArr = [];
    //   var fileArray = [];

    //   //make promise array
    //   keys.forEach((key, index, array) => {
    //     promiseArr.push(
    //       $q((resolve, reject) => {
    //         storage.get(key, (error, data) => {
    //           if (/Qm/.test(key)) {
    //             fileArray.push({
    //               [key]: data
    //             })
    //           }
    //           resolve();
    //         })
    //       }))
    //   })

    //   $q.all(promiseArr).then(() => {
    //     console.log("All data from LOCAL STORAGE", fileArray)
    //     fileData.length = 0;
    //     fileData.push.apply(fileData, fileget(fileArray))
    //   })
    // })
  }

  function fileget(fileArray) {
    let arr = [];
    let type;
    fileArray.forEach(function (item, index) {
      //finds file type
      type = testFileType(item);
      arr.push({
        item: item[Object.keys(item)].file,
        time: item[Object.keys(item)].time,
        url: item[Object.keys(item)].url,
        fileType: type,
        hash: Object.keys(item)[0],
        files: item[Object.keys(item)].files,
      })
    })
    return arr;
  };

  function testFileType(item) {
    //commented out all other lines to deal with error on empty file storage
    return 'other'
    // let fileName = item[Object.keys(item)].file
    // // console.log(item)
    // if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.PNG') || fileName.includes('.jpeg')) {
    //   return 'image';
    // } else if (!fileName.includes('.')) {
    //   return 'folder';
    // } else if (fileName.includes('.xl')) {
    //   return 'excel';
    // } else if (fileName.includes('.pdf') || fileName.includes('.txt') || fileName.includes('.doc')) {
    //   return 'doc';
    // } else {
    //   return 'other';
    // }
  }
  function getFileData() {
    return fileData;
  }
  return {
    addHash: addHash,
    data: fileData,
    add: addToFileData,
    getFileData: getFileData,
    init: loadFilesFromStorage
  }
}