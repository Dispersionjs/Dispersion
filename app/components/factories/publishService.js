var module = angular
  .module('PublishService', [])

module.factory('PublishService', function ($q) {
  return {
    loadPublished: function() {
      let promise = $q(function (resolve, reject) {
        storage.get('published', function (error, data) {
          if (error) throw error;
          resolve(data) 
        })
      })
      return promise;
    }
  }
});