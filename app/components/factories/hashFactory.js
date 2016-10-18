var module = angular
  .module('HashFactory', [])

module.service('HashFactory', function ($q) {
  return {
    loadFilesFromStorage: function ($scope) {
      storage.keys(function (error, keys) {
        if (error) throw error;

        var promiseArr = [];
        var fileArray = [];

        //make promise array
        keys.forEach((key, index, array) => {
          promiseArr.push(
            $q((resolve, reject) => {
              storage.get(key, (error, data) => {
                if (/Qm/.test(key)) {
                  fileArray.push({
                    [key]: data
                  })
                }
                resolve();
              })
            }))
        })

        $q.all(promiseArr).then(() => {
          console.log("All data from LOCAL STORAGE", fileArray)
          $scope.files = fileget(fileArray)
        })
      })
    },

    addToPublish: function (value) {
      let getPublishData = function () {
        let getPromise = new Promise(function (resolve, reject) {
          storage.get('published', function (error, data) {
            if (error) throw error;
            resolve(data)
          })
        })
        return getPromise;
      }

      let setPublishData = function (data) {
        let publishObject = data;
        //add to publishObject
        console.log(data)
        data[value.item] = [{ 'date': value.time, 'hash': value.hash, 'publish': false, 'changed': value.fileType, 'url': value.url, 'files': value.files }];
        console.log(data)
        let setPromise = new Promise(function (resolve, reject) {
          storage.set('published', data, function (error) {
            if (error) throw error;
            resolve();
          });
        });
        return setPromise;
      }

      return (
        getPublishData().then(function (data) {
          return setPublishData(data)
        })
      )
    }
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
