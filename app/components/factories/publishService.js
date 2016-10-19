var module = angular
  .module('PublishService', [])


module.factory('PublishService', ['$q', pubService]);

function pubService($q) {
  let publishData = {};
  function init() {
    return loadPublished()
  }
  function loadPublished() {
    return $q(function (resolve, reject) {
      storage.get('published', function (error, data) {
        if (error) throw error;
        publishData = Object.assign(publishData, data);
        console.log('publishData in publish service:', publishData)
        resolve(data)
      });
    })
  }
  function updateStore() {
    // uncomment later, just for a check
    storage.set('published', publishData)
  }
  function addToPublish(pubObj) {
    console.log('add to publish called in publish service');
    console.log('pubObj in add to publish: \n', pubObj);
    for (let key in pubObj) {
      if (!publishData[key]) {
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
  }
}

// somectrl

// PublishService.load()
// somectrl.data = PublishService.data;
// PublishService.add(pubObj)
// PublishService.init().then((storedData) => {

// })

