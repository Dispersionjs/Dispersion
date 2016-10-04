// required by the index.html file
// executed in the renderer process for that window.
var exec = require('child_process').exec;


$("#ipns-button").on("click", function() {
  alert("Are you ready to put your stuff on the dag?");
  // '/Users/jastiling/Documents/tempDaemon/index.html'
  addDirectory($('#hashfile').val())
});

$("#ipns-button").on("click", function() {
  alert("Are you ready to put your stuff on the dag?");
  // '/Users/jastiling/Documents/tempDaemon/index.html'
  addPin($('#inputPin').val())
});

//ipfs command functions


function addDirectory(filePath) {
  let hashPath = ('ipfs add -r ' + filePath)
  exec(hashPath, function(error, stdout, stderr) {
    let outArr = stdout.split(' ')
    if (outArr[0] === "added") {
      publishHash(outArr[1]);
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
  exec(publishIt, function(error, stdout, stderr) {
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
  let pinCommand = 'ipfs pin add' + pinHash;
  exec(pinCommand, function(error, stdout, stderr) {
    console.log(stdout)
    console.log('successfully pinned')
    console.log('save as filename of choice?')
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
