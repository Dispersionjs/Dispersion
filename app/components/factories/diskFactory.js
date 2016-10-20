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
    
    let copyFrom = path.resolve('/' + copyFromPath);
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
    PublishService.loadPublished().then((data) => {
      console.log(Object.keys(data))
       console.log(data["codesmithHackathon1"])
    })

    let pathToOverwrite = path.resolve(__dirname + `/../projectFolder` + projectName, fileName);
    console.log(pathToOverwrite)
    // fs.writeFile(pathToOverwrite, data, (err) => {
    //   if (err) return console.error(err);
    //   console.log('overwrote file at this path: \n', path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName))
    // })
  }

  function deleteAProjectFolder(projectFolderName) {
    let folderDepthArr = projectFolderName.split('/');
    let folderName = '/' + folderDepthArr[folderDepthArr.length - 1]
    let folderPathToDelete = path.resolve(__dirname + `/../projectFolder` + folderName)

    fs.unlink(folderPathToDelete, (err) => {
      if (err) throw err;
      console.log('deleted file')
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