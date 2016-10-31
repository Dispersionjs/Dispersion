





angular.module('FileHistoryFactory', [])
  .factory('FileHistoryFactory', ['ProjectService', '$q', 'IpfsService', '$timeout', fileHistoryFactory])

function fileHistoryFactory(ProjectService, $q, IpfsService, $timeout) {
  var historyData = {}
  function init() {
    return $q((resolve, reject) => {
      storage.get('fileVersions', (error, data) => {
        if (error) reject(error)
        console.log('file version data from local storage in init', data);
        for (let key in data) {
          historyData[key] = data[key]
        }
        resolve(data)
        // if (error) reject(error)
        //update history array

      })

    });
  }
  function getFileHistory() {
    return historyData
  }

  function updateLocalStorage() {
    storage.set('fileVersions', historyData)
  }


  function addFileVersion(fileVersionObj, projectName) {
    console.log('addFileVersion called in fileHistoryFactory, fileVersionObj, projectname: \n', fileVersionObj, projectName);
    historyData[projectName].push(fileVersionObj);
    $timeout((updateLocalStorage), 5000);
  }
  function addInitialFileVersionOnPublish(date, url, hash, filesArray, projectName) {
    console.log('addintila file version on publish, passed in args: ', ...arguments)
    if (!historyData[projectName]) {
      historyData[projectName] = [];
      filesArray.forEach((filename, index) => {
        historyData[projectName].push({
          date: date,
          url: url + filename,
          hash: hash,
          file: filename
        })
        console.log(`item #${index} added: `, {
          date: date,
          url: url + filename,
          hash: hash,
          file: filename
        });
      })
      updateLocalStorage()
    }
    // historyData[projectName].push(fileVersionObj);
    // $timeout((updateLocalStorage), 2000);
  }

  return {
    fileHistory: historyData,
    getFileHistory: getFileHistory,
    add: addFileVersion,
    init: init,
    initialAdd: addInitialFileVersionOnPublish
  };
}
