var module = angular
  .module('DiskFactory', [])

module.factory('DiskFactory', ['$q', 'PublishService', diskFactory]);

function diskFactory($q, PublishService) {
  //Add "projectFolder" to local app folder
  //Return promise
  function initProjectFolder() {
    fse.mkdirsSync(path.resolve(__dirname + `/../projectFolder`), (err) => {
      if (err) return console.error(err);
      console.log('projectFolder made in Dispersion directory');
    });
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
    // PublishService.loadPublished().then((data) => {
    //   console.log(Object.keys(data))
    //    console.log(data["codesmithHackathon1"])
    // })
    fileName = "index.html"
    projectName = "codesmithHackathon1"
    data = 'longmcDick'

    let overwriteFile = path.resolve(__dirname + `/../projectFolder/` + projectName + '/' + fileName);
    fs.writeFile(overwriteFile, data , (err) => {
      if (err) return console.error(err);
      // console.log('overwrote file at this path: \n', path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName))
    })

    let ipfsAddProject = path.resolve(__dirname + `/../projectFolder/` + projectName)      
    let command = `ipfs add -r ${ipfsAddProject}`;

    exec(command, function (error, stdout, stderr) {
      //grabs just the filename from the absolute path of the added file
      // let fileLocationArray = hashFile.split('/');
      console.log(stdout)
      // let name = fileLocationArray[fileLocationArray.length - 1];
      // //separate hashes from folder into an array
      let hashArray = stdout.trim().split('\n');
      let topFolder = hashArray[hashArray.length - 1].split(' ');
      console.log('top folder hash: ', topFolder)
      let tophash = topFolder.slice(1,2).join(' ');
      console.log('top hash: ', tophash)


      PublishService.add(
      {
        [value.item]:
        [
          {
            'date': value.time,
            'hash': value.hash,
            'publish': false,
            'changed': null,
            'url': value.url,
            'files': value.files
          }
        ]
      });      
      // let hashObj = {
      //   "file": file,
      //   "time": new Date().toUTCString(),
      //   "url": "https://ipfs.io/ipfs/" + topHash[1],
      //   'files': []
      // }    
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