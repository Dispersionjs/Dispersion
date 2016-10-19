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
const username = require('username');
const fse = require('fs-extra');
const path = require('path');
const {dialog} = require('electron').remote;


(function (window) {
  //Dispersion Library Definition
  function define_Dispersion_Library() {
    var Dispersion = {};


    // On click submits inputed file to be hashed.
    Dispersion.submitFile = function (filepath) {

      //file or directory to be hashed.
      let hashFile = filepath
      if (hashFile.includes('/')) hashFile = `"${hashFile}"`;
      // recursively hashes directory or file and adds to ipfs
      let command = `ipfs add -r ${hashFile}`;

      exec(command, function (error, stdout, stderr) {
        //grabs just the filename from the absolute path of the added file
        let fileLocationArray = hashFile.split('/');
        let name = fileLocationArray[fileLocationArray.length - 1];
        //separate hashes from folder into an array
        let hashArray = stdout.trim().split('\n');
        let topHash = hashArray[hashArray.length - 1].split(' ');
        let file = topHash.slice(2).join(' ');
        let hashObj = {
          "file": file,
          "time": new Date().toUTCString(),
          "url": "https://ipfs.io/ipfs/" + topHash[1],
          'files': []
        }
        //iterates over the individual hashes, makes requests to them, and stores top level hash in local storage
        hashArray.forEach(function (hString, index) {
          let tempArray = hString.split(' ');
          var requestObj = {
            [tempArray[1]]: {
              "url": "https://ipfs.io/ipfs/" + tempArray[1]
            }
          }
          //grabs the inner file paths and pushes into file array
          if (index < hashArray.length - 1) {
            hashObj.files.push(`/${tempArray[2].split('/').slice(1).join('/')}`)
          }
          //store top hash in local storage
          storage.set(topHash[1], hashObj, function (error) {
            if (error) throw error;
          });
          //requests each hash url 5 times

          //good functionality to abstract into its own function 
          for (let key in requestObj) {
            let url = requestObj[key]["url"]
            for (let i = 0; i < 5; i++) {
              request(url, (err, response, body) => {
                if (err) {
                  console.log('error making distribute request to IPFS');
                  console.error(err);
                } else {
                  console.log(url)
                  console.log(response.statusCode)
                }
              })
            }
          }
        })
      })
    }

    //Removes the pinned object from local storage.
    Dispersion.unPin = function (pinHash) {
      let pinRmCommand = 'ipfs pin rm ' + pinHash;
      exec(pinRmCommand, function (error, stdout, stderr) {
        storage.remove(pinHash, function (error) {
          if (error) throw error;
        });
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      })
    }

    //publishes the hash to the Peer ID ipns
    Dispersion.publishHash = function (hash) {
      let publishIt = 'ipfs name publish ' + hash;
      console.log(publishIt);
      exec(publishIt, function (error, stdout, stderr) {
        console.log(stdout, hash);
        let hashed = `http://gateway.ipfs.io/ipns/${stdout.split(' ')[2].slice(0, -1)}`
        //$('#hashlink').text(hashed);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      })
    }

    //function to add pin to local storage
    Dispersion.addPin = function (pinHash, pinDescription) {
      let pinCommand = 'ipfs pin add ' + pinHash;
      let hashObject = {
        "file": pinDescription,
        "pinnedBy": 'someone else',
        "pinDate": new Date(),
        "url": "https://ipfs.io/ipfs/" + pinHash
      };
      exec(pinCommand, function (error, stdout, stderr) {
        //saves pinned hash to Electron App storage
        storage.set(pinHash, hashObject, function (error) {
          if (error) throw error;
        });
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      })
    }

    //save selected hash to local computer's desktop
    Dispersion.saveToDisk = function (pinHash, username) {
      //set save-to directory to a file on user's desktop
      let directory = `/Users/${username}/Desktop/ipfs`
      let pinSaveCommand = `ipfs get --output="${directory}" ${pinHash}`;
      exec(pinSaveCommand, function (error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
        //get data from hash for file save
        storage.get(pinHash, function (error, data) {
          if (error) throw error;
          //check if the hash has already been pinned.
          if (Object.keys(data).length === 0) {
            alert("Please pin before download!");
            return;
          }
          //initial location and name of saved hash. Default to Desktop
          let fileLocation = `${directory}/${pinHash}`
          //filename of hash
          let filename = data.file
          let fileExtension;
          //determine and set file extension for saving
          if (!filename.includes('.')) {
            let buffer = readChunk.sync(fileLocation, 0, 262);
            fileExtension = `.${fileType(buffer).ext}`;
          } else {
            fileExtension = ''
          }
          //rename file based on filename and extension
          fs.rename(fileLocation, `"${directory}/${filename}${fileExtension}"`, function (err) {
            if (err) console.log('ERROR: ' + err);
          });
        });
      })
    }

    //function to start daemon
    Dispersion.startDaemon = function () {
      let daemonCommand = spawn('ipfs', ['daemon']);
      daemonCommand.stdout.on('data', function (data) {
        let dataString = data.toString();
        let result = /Daemon is ready/.test(dataString);
        if (result) {
          console.log('the daemon is running')
        }
      });
      daemonCommand.stderr.on('data', function (data) {
        let dataString = data.toString();
        let result = /daemon is running/.test(dataString);
        if (result) {
          console.log('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
        }
      })
    }
    return Dispersion;
  }

  document.ondragover = document.ondrop = (ev) => {
    ev.preventDefault()
  }

  document.body.ondrop = (ev) => {
    console.log('hi ', ev.dataTransfer.files[0].path)
    $('#hash-input').val(ev.dataTransfer.files[0].path);
    ev.preventDefault()
    $('#hash-input').trigger('input');
    // $('#project-input').trigger('input');
  }






  //define globally if it doesn't already exist
  if (typeof (Dispersion) === 'undefined') {
    window.Dispersion = define_Dispersion_Library();
  } else {
    console.log("Dispersion already defined.");
  }

})(window);
