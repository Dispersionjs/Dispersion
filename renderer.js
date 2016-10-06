// required by the index.html file
// executed in the renderer process for that window.
var childProcess = require('child_process')
const exec = childProcess.exec;
const spawn = childProcess.spawn;
const storage = require('electron-json-storage');

// Starts Daemon for IPFS
startDaemon();

//generate list of store hashes
hashList();

// On click submits inputed file to be hashed.
$("#ipns-button").on("click", function() {

  //checks if ipfs add includes wrapper
  let radioValue = $("input[name='optradio']:checked").val();
  //file to be hashed
  let hashValue = $('#hashfile').val();
  //commands for adding to ipfs (with or without wrapper)
  let Command = `ipfs add -r ${hashValue}`;
  let CommandWrapper = `ipfs add -r ${hashValue} -w`;

  //flag indicating if wrapped
  let wrapperFlag;

  //execute ipfs add function
  if (radioValue === 'wrapper-add') {
    wrapperFlag = true;
    addDirectory(hashValue, CommandWrapper, wrapperFlag)
  } else if (radioValue === 'add') {
    wrapperFlag = false;
    addDirectory(hashValue, Command, wrapperFlag)
  }
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
  saveToDisk($('#save-input').val(), $('#save-folder').val())
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
          let keyDiv = `<div>the hash is ${key} and the file is ${data.filename}.</div><div> PinSource is ${data.pinnedBy}.</div><div> Was pinned on ${data.pinDate}</div>`
          hashList.append(keyDiv);
        }
      })
    })
  });
}

//function to add new hash to ipfs
function addDirectory(filePath, hashType, wrapperFlag) {
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
    //properties of the added hash to be stored
    let hashObject = {
      filename: filePath,
      pinnedBy: 'me',
      pinDate: new Date()
    };
    //store new hash and its properties to Electron App
    storage.set(hash, hashObject, function(error) {
      if (error) throw error;
    });
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
  let pinProperties = {
    filename: pinDescription,
    pinnedBy: 'someone else',
    pinDate: new Date()
  };
  exec(pinCommand, function(error, stdout, stderr) {
    //saves pinned hash to Electron App storage
    storage.set(pinHash, pinProperties, function(error) {
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
  let pinRmCommand = 'ipfs pin rm ' + pinHash;
  exec(pinRmCommand, function(error, stdout, stderr) {
    storage.remove(pinHash, function(error) {
      console.log(`${pinHash} removed`)
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
  console.log(pinSaveCommand);
  exec(pinSaveCommand, function(error, stdout, stderr) {
    console.log(stdout);
    storage.get(pinHash, function(error) {
      console.log(pinHash)
      if (error) throw error;
    });
    if (error !== null) {
      console.log('exec error: ' + error);
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
