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
$("#ipns-button").on("click", function () {
  alert("Are you ready to put your stuff on the dag?");
  addDirectory($('#hashfile').val())
});

// on click pins hash to local ipfs.
$("#pin-button").on("click", function () {
  addPin($('#inputPin').val(), $('#pinDescription').val())
});

function hashList() {
  storage.keys(function (error, keys) {
    if (error) throw error;
    let hashList = $('#hash-list');
    hashList.empty();
    keys.forEach(function (key) {
      storage.get(key, function (error, data) {
        if (key.length === 46) {
          let keyDiv = `<div>the hash is ${key} and the file is ${data.filename}.</div><div> PinSource is ${data.pinnedBy}.</div><div> Was pinned on ${data.pinDate}</div>`
          hashList.append(keyDiv);
        }
      })
    })
  });
}


//ipfs command functions


function addDirectory(filePath) {
  let hashPath = ('ipfs add -r "' + filePath + '"')
  exec(hashPath, function (error, stdout, stderr) {
    let outArr = stdout.split(' ')
    let hash = outArr[1];
    let hashObject = {
      filename: filePath,
      pinnedBy: 'me',
      pinDate: new Date()
    };
    storage.set(hash, hashObject, function (error) {
      if (error) throw error;
    });
    if (outArr[0] === "added") {
      hashList();
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
  console.log(publishIt)
  exec(publishIt, function (error, stdout, stderr) {
    console.log(stdout)
    let hashed = `http://gateway.ipfs.io/ipns/${stdout.split(' ')[2].slice(0, -1)}`
    console.log(hashed);
    $('#hashlink').text(hashed);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//function to add pin to local storage
function addPin(pinHash, pinDescription) {
  let pinCommand = 'ipfs pin add ' + pinHash;
  exec(pinCommand, function (error, stdout, stderr) {
    storage.set(pinHash, {
      filename: pinDescription,
      pinnedBy: 'someone else',
      pinDate: new Date()
    }, function (error) {
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
  exec(pinRmCommand, function (error, stdout, stderr) {
    storage.remove(pinHash, function (error) {
      console.log(`${pinHash} removed`)
      hashList();
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
  daemonCommand.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
    let dataString = data.toString();
    let result = /Daemon is ready/.test(dataString);
    if (result) {
      alert('the daemon is running')
    }
  });
  daemonCommand.stderr.on('data', function (data) {
    let dataString = data.toString();
    let result = /daemon is running/.test(dataString);
    if (result) {
      alert('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
    }
  })
}

//Drag and drop to add to dag
document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  console.log(ev.dataTransfer.files[0].path)
  $('#hashfile').val(ev.dataTransfer.files[0].path);
  ev.preventDefault()
}
