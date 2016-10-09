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
    let type;
    fileArray.forEach(function(item, index) {
      //finds file type
      type = testFileType(item);
      arr.push({
        item: item[Object.keys(item)].file,
        time: item[Object.keys(item)].time,
        url: item[Object.keys(item)].url,
        fileType: type
      })
    })
    return arr;
  }

  function testFileType(item) {
    let fileName = item[Object.keys(item)].file
    if (fileName.includes('.jpg') || fileName.includes('.png')) {
      return 'image';
    } else if (!fileName.includes('.')) {
      return 'folder';
    } else if (fileName.includes('.xl')) {
      return 'excel';
    } else if (fileName.includes('.pdf') || fileName.includes('.txt') || fileName.includes('.doc')) {
      return 'doc';
    }
  }

  return init()

});;
