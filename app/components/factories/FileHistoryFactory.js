





angular.module('FileHistoryFactory', [])
  .factory('FileHistoryFactory', ['ProjectService', '$q', 'IpfsService', '$timeout', fileHistoryFactory])

function fileHistoryFactory(ProjectService, $q, IpfsService, $timeout) {
  var historyData = {}
  function init() {
    return $q((resolve, reject) => {
      storage.get('fileVersions', (error, data) => {
        if (error) reject(error)
        console.log('data in init', data);
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
    // storage.set('fileVersions', historyData)
  }


  function addFileVersion(fileVersionObj, projectName) {
    historyData[projectName].push(fileVersionObj);
    $timeout((updateLocalStorage), 2000);

  }

  return {
    fileHistory: historyData,
    getFileHistory: getFileHistory,
    add: addFileVersion,
    init: init
  };
}







const testFileData = {
  "Dispersion": [
    {
      "date": "2016-10-18T18:22:23.133Z",
      "hash": "QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec/index.html",
    },
    {
      "date": "2016-10-19T18:22:23.133Z",
      "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC/index.html",
    },
    {
      "date": "2016-10-20T18:22:23.133Z",
      "hash": "QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY/index.html",
    }
  ],
  "yang": [
    {
      "date": "2016-10-18T18:22:23.133Z",
      "hash": "QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec/index.html",
    },
    {
      "date": "2016-10-19T18:22:23.133Z",
      "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC/index.html",
    }
  ]
}