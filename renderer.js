// required by the index.html file
// executed in the renderer process for that window.
const childProcess = require('child_process')
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const storage = require('electron-json-storage');
const fs = require('fs');
const readChunk = require('read-chunk'); // npm install read-chunk
const fileType = require('file-type');
const https = require('https');
const request = require('request');

// Starts Daemon for IPFS
startDaemon();

//generate list of store hashes
hashList();

// On click submits inputed file to be hashed.
$("#ipns-button").on("click", function() {

  //file to be hashed. add quotes to ignore possible spaces
  let hashFile = $('#hashfile').val();
  if (hashFile.includes('/')) hashFile = `"${hashFile}"`
    //commands for adding to ipfs (with or without wrapper)
  let command = `ipfs add -r ${hashFile}`;

  //flag indicating if wrapped
  let wrapperFlag;

  //check if the input is a file or directory.
  //If it is a directory, then add a wrapper.
  if (hashFile.includes('.')) {
    wrapperFlag = false;
  } else {
    wrapperFlag = true;
    command = `${command} -w`;
  }

  //execute ipfs add function
  addDirectory(hashFile, command, wrapperFlag)

});

// Clicking button pins hash to local ipfs.
$("#pin-button").on("click", function() {
  addPin($('#inputPin').val(), $('#pinDescription').val())
});

// Clicking button deletes hash.
$("#delete-button").on("click", function() {
  unPin($('#delete-pin').val())
});

$("#save-button").on("click", function() {
  let fileSavePath = $('#save-folder').val();
  if (fileSavePath === '') {
    filesavepath = "savedfiles"
  }
  saveToDisk($('#save-input').val(), filesavepath)
});

$("#delete-all").on("click", function() {
  clearPinsFromElectron()
});

//the list of all locally pinned hashes
function hashList() {
  storage.keys(function(error, keys) {
    if (error) throw error;
    let hashList = $('#hash-list');
    hashList.empty();
    keys.forEach(function(key) {
      storage.get(key, function(error, data) {
        if (key.length === 46) {
          let keyDiv = `<div>the hash is ${key} and the data is ${JSON.stringify(data, null, 2)}`
          hashList.append(keyDiv);
        }
      })
    })
  });
}

// This function will clear local storage and remove all associated pins.
function clearPinsFromElectron() {
  storage.keys(function(error, keys) {
    if (error) throw error;
    keys.forEach(function(key) {
      unPin(key)
    })
  });
}

// function

//function to add new hash to ipfs
function addDirectory(filePath, hashType, wrapperFlag) {
  //escape spaces in foldername
  exec(hashType, function(error, stdout, stderr) {

    let outArr = stdout.split(' ')
      //hash output from adding new file or directory
    let hash;
    //check if hash type has a top level wrapper hash
    if (wrapperFlag) {
      //grab highest level hash from output string
      hash = outArr[outArr.length - 2];
    } else {
      hash = outArr[1];
    }
    //grabs just the filename from the absolute path of the added file
    let fileLocationArray = filePath.split('/');
    let file = fileLocationArray[fileLocationArray.length - 1];
    //properties of the added hash to be stored
    let hashObject = {
      "filename": file,
      "pinnedBy": 'me',
      "pinDate": new Date(),
      "url": "http://ipfs.io/ipfs/" + hash
    };
    //store new hash and its properties to Electron App
    console.log(hash)
    storage.set(hash, hashObject, function(error) {
      if (error) throw error;
    });

    //make requests to the added hash
    //test requests
    // let hashArr = stdout.trim().split('\n');
    // let itemHash;
    // console.log('hashArr', hashArr)
    // hashArr.forEach((item, index, array) => {
    //   itemHash = item.split(' ')[1];
    //   storage.get(itemHash, hashObject, function(error) {
    //
    //     if (error) throw error;
    //   });
    //   requestHashObject(hashObject, itemHash);
    // })


    //requestHashObject(hashObject)
    if (outArr[0] === "added") {
      //refresh hash list
      hashList();
      //publish hash to ipns
      publishHash(hash);
    }
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//publishes the hash to the Peer ID ipns
function publishHash(hash) {
  let publishIt = 'ipfs name publish ' + hash;
  exec(publishIt, function(error, stdout, stderr) {
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
    "filename": pinDescription,
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
    //make requests to the added hash
    //requestHashObject(hashObject)
}

// Function  that removes a pin from local storage.
function unPin(pinHash) {
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
  exec(pinSaveCommand, function(error, stdout, stderr) {
    if (error !== null) console.log('exec error: ' + error);
    storage.get(pinHash, function(error, data) {
      if (error) throw error;
      if (!data.filename) {
        alert("Please pin before download!");
        return;
      }
      let fileLocation = `${directory}/${pinHash}`
      let filename = data.filename
      let fileExtension = hasExtension(fileLocation, filename);
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
    return `.${fileType(buffer).ext}`;
  }
}


//function to request all hashed objects in newly added directory
function requestHashObject(hashObject) {
  console.log(hashObject)
  request(hashObject["url"], (err, response, body) => {
    if (err) {
      console.log('error making distribute request to IPFS');
      console.error(err);
    }
  })
}

//function to start daemon
function startDaemon() {
  let daemonCommand = spawn('ipfs', ['daemon']);
  daemonCommand.stdout.on('data', function(data) {
    let dataString = data.toString();
    let result = /Daemon is ready/.test(dataString);
    if (result) {
      alert('the daemon is running')
    }
  });
  daemonCommand.stderr.on('data', function(data) {
    let dataString = data.toString();
    let result = /daemon is running/.test(dataString);
    if (result) {
      alert('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
    }
  })
}

//Drag and drop to add to ipfs
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  $('#hashfile').val(ev.dataTransfer.files[0].path);
  ev.preventDefault()
}
