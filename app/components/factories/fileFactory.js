var module = angular
  .module('FileFactory', [])

module.service('FileFactory', ['$q', 'IpfsService', fileFactory]);

function fileFactory($q, IpfsService) {
  let fileData = [];

  function addToFileData(hashObj) {
    hashObj.fileType = testFileType(hashObj);
    fileData.push(hashObj);
    storage.set('files', fileData, (error) => {
      if (error) {
        console.log('error in addFile to data in file Factory, the error is: \n');
        console.error(error);
      }
    })
  }

  function removeFile(index) {
    fileData.splice(index,1);
    storage.set('files', fileData, (error) => {
      if (error) {
        console.log('error in addFile to data in file Factory, the error is: \n');
        console.error(error);
      }
    })
  }


  function addHash() {
    dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] }, function (selected) {
      if (selected) {
        IpfsService.addFile(selected[0]).then((addedHashObject) => {
          addedHashObject.pathToFile = selected[0];
          console.log('path on obj', addedHashObject.pathToFile);
          addToFileData(addedHashObject);
        });
      }
    });
  }

  function init() {
    return $q((resolve, reject) => {
      storage.get('files', (error, data) => {
        console.log('files key in local storage', data)
        if (error) {
          console.error(error)
          reject()
        } else {
          Object.assign(fileData, data);
          console.log('files loaded from storage: \n', data)
          resolve(fileData);
        }
      })
    })
  }
  function testFileType(item) {
    let fileName = item.file
    if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.PNG') || fileName.includes('.jpeg')) {
      return 'image';
    } else if (!fileName.includes('.')) {
      return 'folder';
    } else if (fileName.includes('.xl')) {
      return 'excel';
    } else if (fileName.includes('.pdf') || fileName.includes('.txt') || fileName.includes('.doc')) {
      return 'doc';
    } else {
      return 'other';
    }
  }

  function getFileData() {
    return fileData;
  }
  return {
    removeFile: removeFile,
    addHash: addHash,
    data: fileData,
    add: addToFileData,
    getFileData: getFileData,
    init: init
  }
}