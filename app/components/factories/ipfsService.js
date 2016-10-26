angular
  .module('IpfsService', [])
  .factory('IpfsService', ['$q', '$interval', ipfsService]);

function ipfsService($q, $interval) {

  ///may have made some breaking changes, please try and clean up and test thoroughly
  let daemonLoadedStatus = () => daemonLoaded;
  let daemonLoaded = false;

  function startDaemon() {
    return $q(function (resolve, reject) {
      let daemonCommand = spawn('ipfs', ['daemon']);
      daemonCommand.stdout.on('data', function (data) {
        let dataString = data.toString();
        let result = /Daemon is ready/.test(dataString);
        if (result) {
          console.log('the daemon is running')
          resolve(result);
        }
      });
      daemonCommand.stderr.on('data', function (data) {
        let dataString = data.toString();
        let result = /daemon is running/.test(dataString);
        if (result) {
          console.log('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
          resolve(result);
        } else {
          reject(dataString);
        }
      })
    })
  }

  //Hashes file, puts it in storage, and requests it to distribute 
  function submitFile(filepath) {
    return $q((resolve, reject) => {
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
        console.log('hash array, tophash');
        console.log(hashArray)
        let topHash = hashArray[hashArray.length - 1].split(' ');
        console.log(topHash)
        let file = topHash.slice(2).join(' ');
        let hashObj = {
          "file": file,
          "hash": topHash[1],
          "date": new Date().toUTCString(),
          "url": "https://ipfs.io/ipfs/" + topHash[1],
          'files': []
        }
        hashArray.forEach(function (hString, index) {
          let tempArray = hString.split(' ');
          var requestObj = {
            [tempArray[1]]: {
              "url": "https://ipfs.io/ipfs/" + tempArray[1]
            }
          }
          if ((/\./.test(tempArray[tempArray.length - 1])) && index < hashArray.length - 1) {
            console.log('tempArray', tempArray)
            // hashObj.files.push(`/${tempArray[2].split('/').slice(1).join('/')}`)
            hashObj.files.push(`/${tempArray.slice(2).join('\ ').split('/').slice(1).join('/')}`)
          }

          requestHashes(requestObj)
          resolve(hashObj)
        })
      })
    })
  }
  function rehashProject(filepath, fileVersionObject, fileName) {
    //file or directory to be hashed.
    // recursively hashes directory or file and adds to ipfs
    let command = `ipfs add -r "${filepath}"`;

    exec(command, function (error, stdout, stderr) {
      //grabs just the filename from the absolute path of the added file

      let hashArray = stdout.trim().split('\n');

      let topHash = hashArray[hashArray.length - 1].split(' ')[1];
      console.log(topHash)
      fileVersionObject.hash = topHash;
      fileVersionObject.url = `https://ipfs.io/ipfs/${topHash}${fileName}`;

      let hashObj = {
        "file": fileName,
        "hash": topHash[1],
        "url": "https://ipfs.io/ipfs/" + topHash[1] + fileName,
      }
      hashArray.forEach(function (hString, index) {
        let tempArray = hString.split(' ');
        var requestObj = {
          [tempArray[1]]: {
            "url": "https://ipfs.io/ipfs/" + tempArray[1]
          }
        }
        requestHashes(requestObj)
      })
    })
  }

  function requestHashes(requestObj) {
    for (let key in requestObj) {
      let url = requestObj[key]["url"];
      for (let i = 0; i < 5; i++) {
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


  function unPin(pinHash) {
    return $q(function (resolve, reject) {
      let pinRmCommand = 'ipfs pin rm ' + pinHash;
      exec(pinRmCommand, function (error, stdout, stderr) {
        storage.remove(pinHash, function (error) {
          if (error) reject(error);
          resolve()
        });
        if (error !== null) {
          reject(error);
        }
      })
    })
  }

  function publishHash(publishObj, projectName) {
    console.log(projectName)
    console.log(publishObj)
    publishObj[0]['publish'] = true;
    console.log('publish obj 0', publishObj)
    hash = publishObj[0]['hash']
    let publishIt = 'ipfs name publish ' + hash;
    exec(publishIt, function (error, stdout, stderr) {
      console.log(stdout, hash);
      let hashed = `http://gateway.ipfs.io/ipns/${stdout.split(' ')[2].slice(0, -1)}`
      //$('#hashlink').text(hashed);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    })
  }

  function addPin(pinHash, pinDescription) {
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

  function getFileData(hash, file) {
    return $q(function (resolve, reject) {
      let fileCommand = `ipfs cat ${hash}/${file}`;
      exec(fileCommand, function (error, stdout, stderr) {
        resolve(stdout)
        if (error !== null) {
          console.log('exec error: ' + error);
        }
      })
    })
  }

  function saveToDisk(pinHash, username) {
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

  function getPeerID() {
    return $q(function (resolve, reject) {
      let idCommand = 'ipfs config show';
      exec(idCommand, function (error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
        let peerID = JSON.parse(stdout)['Identity']['PeerID'];
        let bootstrap = JSON.parse(stdout)['Bootstrap'];
        let ipnsLink = `https://gateway.ipfs.io/ipns/${peerID}`;
        let peerArray = [ipnsLink, bootstrap]
        resolve(peerArray)
      })
    })
  }

  function addBootstrapPeer(peerAddress) {
    return $q(function (resolve, reject) {
      let idCommand = `ipfs bootstrap add ${peerAddress}`;
      exec(idCommand, function (error, stdout, stderr) {
        if (error !== null) console.log('exec error: ' + error);
        let success = `peer added`
        resolve(success)
      })
    })
  }

  return {
    addPeer: addBootstrapPeer,
    peerID: getPeerID,
    getFileData: getFileData,
    rehashProject: rehashProject,
    init: startDaemon,
    addFile: submitFile,
    saveToDisk: saveToDisk,
    pin: addPin,
    unPin: unPin,
    publish: publishHash,
  }
}