var module = angular
  .module('DiskFactory', [])

module.factory('DiskFactory', ['$q', 'PublishService', 'IpfsService', diskFactory]);

function diskFactory($q, PublishServic, IpfsService) {
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
  function overwriteFileInProject(fileName, projectName, data, fileVersionObj) {
    if (fileName[0] !== '/') fileName = '/' + fileName;
    let pathToProjectFolder = path.resolve(__dirname + `/../projectFolder/` + projectName);
    fs.writeFile(pathToProjectFolder + fileName, data, (err) => {
      if (err) return console.error(err);
      IpfsService.rehashProject(pathToProjectFolder, fileVersionObj, fileName)
      // console.log('overwrote file at this path: \n', path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName))
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