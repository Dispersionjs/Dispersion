// required by the index.html file
// executed in the renderer process for that window.
var exec = require('child_process').exec;
const storage = require('electron-json-storage');

// Starts Daemon for IPFS
startDaemon();


// On click submits inputed file to be hashed.
$("#ipns-button").on("click", function () {
  alert("Are you ready to put your stuff on the dag?");
  addDirectory($('#hashfile').val())
});

// on click pins hash to local ipfs.
$("#pin-button").on("click", function () {
  addPin($('#inputPin').val())
});


//ipfs command functions


function addDirectory(filePath) {
  let hashPath = ('ipfs add -r "' + filePath + '"')
  exec(hashPath, function (error, stdout, stderr) {
    let outArr = stdout.split(' ')
    let hash = outArr[1];
    storage.set(hash, { filename: filePath }, function (error) {
      if (error) throw error;
    });
    if (outArr[0] === "added") {
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
    $('#hashlink').text(hashed)
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//function to add pin to local storage
function addPin(pinHash) {
  let pinCommand = 'ipfs pin add ' + pinHash;
  exec(pinCommand, function (error, stdout, stderr) {
    console.log(stdout)
    console.log('successfully pinned')
    console.log('save as filename of choice?')
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
}

//function to start daemon
function startDaemon() {
  let daemonCommand = 'ipfs daemon';
  exec(daemonCommand, function (error, stdout, stderr) {
    if (error !== null) {
      console.log('exec error: ' + error);
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
