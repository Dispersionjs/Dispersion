/**
 * HashFactory reads a json file with all of the users pinned hashes
 */

var module = angular
  .module('HashFactory', [])

module.factory('HashFactory', function ($q) {
  // let files = 0;

  return {
    getFiles: function () {
      storage.keys(function (error, keys) {
        if (error) throw error;
        console.log('storage.keys', keys)

        var promiseArr = [];
        var fileArray = [];

        //make promise array          
        keys.forEach((key, index, array) => {
          promiseArr.push(
            $q((resolve, reject) => {
              storage.get(key, (error, data) => {
                console.log("storage.get key from promise array", key)
                if (/Qm/.test(key)) {
                  fileArray.push({ [key]: data })
                }  
                resolve(fileArray);
              })
            }))
        })
        
        return $q.all(promiseArr)
        // return $promiseArr
        //   .then(() => {
        //   console.log("THIS IS THE REFEACTORED", fileArray)
        //   // return fileget(fileArray);
        // })
      })
    },



    fileget: function (fileArray) {
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
          hash: Object.keys(item)[0]
        })
      })
      return arr;
    }

  }


  function testFileType(item) {
    let fileName = item[Object.keys(item)].file
    if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.JPG') || fileName.includes('.PNG') || fileName.includes('.jpeg')) {
      return 'image';
    } else if (!fileName.includes('.')) {
      return 'folder';
    } else if (fileName.includes('.xl')) {
      return 'excel';
    } else if (fileName.includes('.pdf') || fileName.includes('.txt') || fileName.includes('.doc')) {
      return 'doc';
    }
  }
});
