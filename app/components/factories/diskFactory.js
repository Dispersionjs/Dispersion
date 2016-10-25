var module = angular
  .module('DiskFactory', [])

module.factory('DiskFactory', ['$q', 'PublishService', diskFactory]);

function diskFactory($q, PublishService) {
  //Add "projectFolder" to local app folder
  //Return promise
  function initProjectFolder() {
    $q((resolve, reject) => {
      fse.ensureDir(path.resolve(__dirname + `/../projectFolder`), (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('projectFolder made in Dispersion directory: ', path.resolve(__dirname + `/../projectFolder`));
          resolve()
        }
      });
    })
  }

  function copyProjectToAppStorage(copyFromPath) {

    let copyFrom = '/' + copyFromPath;
    let pathBrokenIntoArray = copyFrom.split('/');
    let project = '/' + pathBrokenIntoArray[pathBrokenIntoArray.length - 1]
    let copyTo = path.resolve(__dirname + `/../projectFolder` + project)

    console.log('copy from ', copyFrom)
    console.log('copyTo ', copyTo)

    fse.copy(copyFrom, copyTo, (err) => {
      if (err) return console.error(err);
      console.log('copied folder to local directory')
    })
  }
  ///Users/ygoldobin/Desktop/test
  ///Users/ygoldobin/Desktop/codesmithHackathon1  
  // (//index.html, dispersion, data)
  function overwriteFileInProject(fileName, projectName, data) {

    fileName = ".gitignore"
    projectName = "FiraCode-master"
    data = 'lonDick'

    let overwriteFile = path.resolve(__dirname + `/../projectFolder/` + projectName + '/' + fileName);
    fs.writeFile(overwriteFile, data, (err) => {
      if (err) return console.error(err);
      // console.log('overwrote file at this path: \n', path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName))
    })

    let ipfsAddProject = path.resolve(__dirname + `/../projectFolder/` + projectName)
    let command = `ipfs add -r ${ipfsAddProject}`;



    exec(command, function (error, stdout, stderr) {
      console.log(stdout)
      let requrl;
      // let name = fileLocationArray[fileLocationArray.length - 1];
      // //separate hashes from folder into an array
      let hashArray = stdout.trim().split('\n');
      let topFolder = hashArray[hashArray.length - 1].split(' ');
      console.log('top folder hash: ', topFolder)
      let folderName = topFolder[2];
      console.log('folderName', folderName)
      let tophash = topFolder[1];
      console.log('top hash: ', tophash)
      requrl = "https://ipfs.io/ipfs/" + tophash;

      PublishService.add(
        {
          [folderName]:
          [
            {
              'date': new Date().toUTCString(),
              'hash': tophash,
              'publish': false,
              'changed': null,
              'url': "https://ipfs.io/ipfs/" + tophash,
              'files': []
            }
          ]
        });

      for (let i = 0; i < 5; i++) {
        request(requrl, (err, response, body) => {
          if (err) {
            console.log('error making distribute request to IPFS');
            console.error(err);
          } else {
            console.log(requrl)
            console.log(response.statusCode)
          }
        })
      }
    })
  }

  function deleteAProjectFolder(deletePath) {

    let pathBrokenIntoArray = deletePath.split('/');
    let deleteProject = '/' + pathBrokenIntoArray[pathBrokenIntoArray.length - 1]
    let deleteIt = path.resolve(__dirname + `/../projectFolder` + deleteProject)

    fse.emptyDir(deleteIt, (err) => {
      if (err) throw err;
      console.log('deleted directory contents')
    })
  }

  //function to clear specific project file given the string;
  //function returns a promise that resolves when a folder is cleared
  //function that requests a hash and resolves a promise with the hash data

  return {
    init: initProjectFolder,
    addProject: copyProjectToAppStorage,
    overwrite: overwriteFileInProject,
    delete: deleteAProjectFolder
  }
}