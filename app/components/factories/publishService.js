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
        resolve(data)
      });
    })
  }
  let currentlyPublished = '';
  function getCurrentlyPublished() {
    return currentlyPublished;
  }
  function updateStore() {
    // uncomment later, just for a check
    storage.set('publish', publishData)
    storage.get('currentlyPublished', (error, data) => {
      currentlyPublished = data;
    })
  }
  function addToPublish(pubObj) {
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
    updateStore()
  }

  return {
    data: publishData,
    add: addToPublish,
    init: init,
    currentlyPublished: getCurrentlyPublished
  }
}


