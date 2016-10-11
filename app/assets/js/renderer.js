// required by the index.html file
// executed in the renderer process for that window.
const childProcess = require('child_process');
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const storage = require('electron-json-storage');
const fs = require('fs');
const readChunk = require('read-chunk'); // npm install read-chunk
const fileType = require('file-type');
const https = require('https');
const request = require('request');

// Starts Daemon for IPFS when app is started
startDaemon();

//generate list of store hashes when app is started
// hashList();

// On click submits inputed file to be hashed.
function submitFile(filepath) {
  //file to be hashed. add quotes to ignore possible spaces
  let hashFile = filepath
  if (hashFile.includes('/')) hashFile = `"${hashFile}"`;

  // recursively hashes directory or file and adds to ipfs
  let command = `ipfs add -r ${hashFile}`;

  //If it is a directory, then add a wrapper hash.
  if (!hashFile.includes('.')) {
    command = `${command} -w`;
  }
  //hashes and adds file or directory to local ipfs node
  addDirectory(hashFile, command)
}

// // Clicking button pins outside hash to the local ipfs node.
// $("#pin-button").on("click", function() {
//   addPin($('#inputPin').val(), $('#pinDescription').val())
// });

// //Save file to folder
// $("#save-button").on("click", function() {
//   let fileSavePath = $('#save-folder').val();
//   if (fileSavePath === '') {
//     filesavepath = "savedfiles"
//   }
//   saveToDisk($('#save-input').val(), filesavepath)
// });

// $("#delete-all").on("click", function() {
//   clearPinsFromElectron()
// });

// $("#hashList-button").on("click", function() {

// });

//set the list of all locally pinned hashes
function hashList() {
  let hashesObj = {};

  storage.keys(function (error, keys) {
    console.log('storage.keys', keys)
    if (error) throw error;
    var promiseArr = [];
    keys.forEach(function(key, index, array) {
      promiseArr.push(new Promise(function(resolve, reject) {
        storage.get(key, function(error, data) {
          if (/Qm/.test(key)) hashesObj[key] = data
          resolve();
        })
      }))
    })

    // storage.set("full-hash-list", JSON.stringify(hashesObj, null, 2), (err) => {
    //     if (err) throw err;
    //     console.log('It\'s saved om storage set!', hashesObj);
    //   })
    Promise.all(promiseArr).then(function (a, b) {
      // storage.set("full-hash-list", JSON.stringify(hashesObj, null, 2), (err) => {
      //   if (err) throw err;
      //   console.log('It\'s saved om storage set!', hashesObj);
      // })
      fs.writeFile('data.json', JSON.stringify(hashesObj, null, 2), (err) => {
        if (err) throw err;
        console.log('It\'s saved in writefile!', hashesObj);
      })
    })
  });
}

//clearPinsFromElectron();
/** This function will clear local storage and remove all associated pins.**/
function clearPinsFromElectron() {
  storage.keys(function(error, keys) {
    if (error) throw error;
    keys.forEach(function(key) {
      unPin(key)
    })
  });
}

//function to add new hash to ipfs
function addDirectory(filePath, hashType) {
  //escape spaces in foldername
  exec(hashType, function(error, stdout, stderr) {

    //grabs just the filename from the absolute path of the added file
    let fileLocationArray = filePath.split('/');
    let file = fileLocationArray[fileLocationArray.length - 1];
    let hashArray = stdout.trim().split('\n');

    hashArray.forEach(function(item) {
      let hashObject = makeHashObject(item);
      requestHashObject(hashObject);

    })

    //refresh hash list
    hashList();
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//publishes the hash to the Peer ID ipns
function publishHash(hash) {
  let publishIt = 'ipfs name publish ' + hash;
  console.log(publishIt);
  exec(publishIt, function(error, stdout, stderr) {
    console.log(stdout, hash);
    let hashed = `http://gateway.ipfs.io/ipns/${stdout.split(' ')[2].slice(0, -1)}`
    $('#hashlink').text(hashed);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//function to add pin to local storage
function addPin(pinHash, pinDescription) {
  let pinCommand = 'ipfs pin add ' + pinHash;
  let hashObject = {
    "file": pinDescription,
    "pinnedBy": 'someone else',
    "pinDate": new Date(),
    "url": "https://ipfs.io/ipfs/" + pinHash
  };
  exec(pinCommand, function(error, stdout, stderr) {

    //saves pinned hash to Electron App storage
    storage.set(pinHash, hashObject, function(error) {
      hashList();
      if (error) throw error;
    });
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

// Function  that removes a pin from local storage.
function unPin(pinHash) {
  console.log("Pin Hash: " + pinHash);
  let pinRmCommand = 'ipfs pin rm ' + pinHash;
  exec(pinRmCommand, function(error, stdout, stderr) {
    storage.remove(pinHash, function(error) {
      hashList();
      if (error) throw error;
    });
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

function saveToDisk(pinHash, directory) {
  let pinSaveCommand = `ipfs get --output="${directory}" ${pinHash}`;
  console.log('pinsavecommand', pinSaveCommand)
  exec(pinSaveCommand, function(error, stdout, stderr) {
    console.log('stdout', stdout)
      // return;
    if (error !== null) console.log('exec error: ' + error);
    storage.get(pinHash, function(error, data) {
      if (error) throw error;

      //check if the hash has already been pinned.
      if (Object.keys(data).length === 0) {
        alert("Please pin before download!");
        return;
      }

      //initial location and name of saved hash
      let fileLocation = `${directory}/${pinHash}`

      //filename of hash
      let filename = data.file

      let fileExtension = hasExtension(fileLocation, filename);

      //rename file based on filename and extension
      fs.rename(fileLocation, `${directory}/${filename}${fileExtension}`, function(err) {
        if (err) console.log('ERROR: ' + err);
      });
    });
  })
}

function hasExtension(fileLocation, filename) {
  if (filename.includes('.')) {
    return "";
  } else {
    let buffer = readChunk.sync(fileLocation, 0, 262);
    console.log('asdfasdfasd')
    return `.${fileType(buffer).ext}`;
  }
}

function makeHashObject(hString) {
  var hashArray = hString.split(' ');
  var file = hashArray.slice(2).join(' ').trim();
  var hashObj = {
    [hashArray[1]]: {
      "file": file ? file : 'wrapper',
      "time": new Date().toUTCString(),
      "url": "https://ipfs.io/ipfs/" + hashArray[1]
    }
  }
  storage.set(hashArray[1], hashObj[hashArray[1]], function(error) {
    if (error) throw error;
  });
  return hashObj;
}

//function to request all hashed objects in newly added directory
function requestHashObject(hashObject) {
  for (let key in hashObject) {
    let url = hashObject[key]["url"]
    for (let i = 0; i < 5; i++) {
      let name = hashObject[key]["file"];
      request(url, (err, response, body) => {
        if (err) {
          console.log('error making distribute request to IPFS');
          console.error(err);
        } else {
          console.log(response.statusCode)
        }
      })
    }
  }
}

//function to start daemon
function startDaemon() {
  let daemonCommand = spawn('ipfs', ['daemon']);
  daemonCommand.stdout.on('data', function(data) {
    let dataString = data.toString();
    let result = /Daemon is ready/.test(dataString);
    if (result) {
      console.log('the daemon is running')
    }
  });
  daemonCommand.stderr.on('data', function(data) {
    let dataString = data.toString();
    let result = /daemon is running/.test(dataString);
    if (result) {
      console.log('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
    }
  })
}

//Drag and drop to add to ipfs
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  $('#hash-input').val(ev.dataTransfer.files[0].path);
  ev.preventDefault()
  $('#hash-input').trigger('input');
}
