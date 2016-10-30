var module = angular
  .module('PublishService', [])


module.factory('PublishService', ['$q', pubService]);

function pubService($q) {
  let publishData = {};
  // function init() {
  //   return loadPublished()
  // }
  function init() {
    return $q((resolve, reject) => {
      storage.get('publish', (error, data) => {
        if (error) reject(error);
        publishData = Object.assign(publishData, data);
        // console.log('publishData in publish service:', publishData)
        storage.get('currentlyPublished', (err, name) => {
          currentlyPublished = name;
          console.log(currentlyPublished);
          resolve(data)
        })
      });
    })
  }
  let currentlyPublished;
  function getCurrentlyPublished() {
    return currentlyPublished;
  }
  function setCurrentlyPublished(name) {
    currentlyPublished = name;
    storage.set('currentlyPublished', name);
  }
  function updateStore() {
    // uncomment later, just for a check
    storage.set('publish', publishData)
    storage.get('currentlyPublished', (error, data) => {
      currentlyPublished = data;
    })
  }
  // //unshift for edit fix is here, add an unhashed object for edit purposes//
  // function unshiftForEditFix(pubObj, name) {
  //   console.log('unshifting pubObj  ', pubObj, "onto  ",name )
  //   publishData[name].unshift(pubObj)
  //   updateStore()
  // }

  function addToPublish(pubObj, snapshot = false, name = '') {
    console.log('publishData ', publishData)
    console.log('pubObj ', pubObj)
    if (snapshot) {
      // for (let key in pubObj) {
      // console.log('key in publishData', publishData[key])
      console.log('unshifting after rehash of project', pubObj)
      console.log(publishData)
      //THIS LINE RIGHT HERE
      publishData[name].unshift(pubObj)
      // }
    } else {
      console.log('add to publish called in publish service');
      console.log('pubObj in add to publish: \n', pubObj);
      for (let key in pubObj) {
        if (!publishData[key]) {
          console.log('key, publishData');
          console.log(key, publishData)
          publishData[key] = pubObj[key];
        } else {
          console.log('this project has already been published')
          //add more logic to maybe just append to array
        }
      }
    }
    updateStore()
  }

  return {
    data: publishData,
    add: addToPublish,
    init: init,
    currentlyPublished: getCurrentlyPublished,
    setPublished: setCurrentlyPublished,
    // unshiftForEditFix: unshiftForEditFix,
    updatePublishData: updateStore
  }
}


