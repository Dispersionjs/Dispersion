/**
 * HashFactory reads a json file with all of the users pinned hashes
 */

var module = angular
  .module('HashFactory', [])

module.factory('HashFactory', function($q) {
  // let files = 0;
  let init = function() {
    return $q(function(resolve, reject) {
      fs.readFile('data.json', 'utf-8', (err, data) => {
        var fileArray = []
        if (err) throw err;
        data = JSON.parse(data)
        let keyArray = Object.keys(data);
        keyArray.forEach(function(item) {
          fileArray.push({
            [item]: data[item]
          })
        })
        resolve(fileArray)
      })
    })
  }


  fileget = function(fileArray) {
    let arr = [];
    fileArray.forEach(function(item, index) {
      arr.push({
        item: item[Object.keys(item)].file,
        time: item[Object.keys(item)].time,
        url: item[Object.keys(item)].url
      })
    })
    return arr;
  }
  return init()

});;
