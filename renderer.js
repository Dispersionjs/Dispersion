// required by the index.html file
// executed in the renderer process for that window.
var exec = require('child_process').exec;


$("#button").on("click", function() {
  alert("Are you ready to put your stuff on the dag?");
  // '/Users/jastiling/Documents/tempDaemon/index.html'
  addDirectory($('#hashfile').val())
});

//ipfs command functions

function addDirectory(filePath) {
  let hashPath = ('ipfs add -r ' + abspathtofile)
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
  exec(publishIt, function(error, stdout, stderr) {
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
