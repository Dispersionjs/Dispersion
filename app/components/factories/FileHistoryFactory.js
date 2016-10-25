





angular.module('FileHistoryFactory', [])
  .factory('FileHistoryFactory', ['ProjectService', '$q', 'IpfsService', fileHistoryFactory])

function fileHistoryFactory(ProjectService, $q, IpfsService) {
  let historyData = {}
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
    })
  }

  //TODO: function to add to object to project service array, should hook into file controller to make effective save event. it should: pass editorcontent data and file name, projectname, save file to project path, overwriting if necessay, then rehash, contstruct what we have before rrefered to as a "publish object" with publish set to false, add that to  project service array. then save the project service array to disk, 
  // const historyData = ProjectService.projectArray;
  /** takes in a file string, returns array of event objects that were files changes, not publish events */
  // function fileVersionArray(file) {
  //   return historyData.filter((version) => {
  //     if (file) {
  //       if (file[0] !== '/') file = '/' + file;
  //       return version.changed === file && version.files.includes(file);
  //     }
  //   });
  // }

  //   {
  //   "date": "2016-10-19T18:22:23.133Z",
  //   "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
  //   "file": "/index.html",
  //   "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC/index.html",
  // },




  function addFileVersion() {
    //on add, call storage.set
    let obj = {
      "date": "2017-10-20T18:22:23.133Z",
      "hash": "QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY",
      "file": "/index.html",
      "url": "https://ipfs.io/ipfs/QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY/index.html",
    }
    // ProjectService.projectArray.push(obj);
    historyData["Dispersion"].push(obj);
  }
  //delete
  //save
  return {
    fileHistory: historyData,
    add: addFileVersion,
    init: init
  };
}







// const testFileData = {
//   "Dispersion": [
//     {
//       "date": "2016-10-18T18:22:23.133Z",
//       "hash": "QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
//       "file": "/index.html",
//       "url": "https://ipfs.io/ipfs/QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec/index.html",
//     },
//     {
//       "date": "2016-10-19T18:22:23.133Z",
//       "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
//       "file": "/index.html",
//       "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC/index.html",
//     },
//     {
//       "date": "2016-10-20T18:22:23.133Z",
//       "hash": "QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY",
//       "file": "/index.html",
//       "url": "https://ipfs.io/ipfs/QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY/index.html",
//     }
//   ],
//   "yang": [
//     {
//       "date": "2016-10-18T18:22:23.133Z",
//       "hash": "QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
//       "file": "/index.html",
//       "url": "https://ipfs.io/ipfs/QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec/index.html",
//     },
//     {
//       "date": "2016-10-19T18:22:23.133Z",
//       "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
//       "file": "/index.html",
//       "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC/index.html",
//     }
//   ]
// }