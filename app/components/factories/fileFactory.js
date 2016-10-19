var module = angular
  .module('FileFactory', [])

module.factory('FileFactory', ['$q', fileService]);

function fileService($q) {
  //Add "projectFolder" to local app folder
  function initProjectFolder() {
    fse.mkdirsSync(path.resolve(__dirname + `/../projectFolder`), (err) => {
      if (err) return console.error(err);
    });
  }

  function copyProjectToAppStorage() {
    /**TODO: Currently when you copy a directory with fse it will copy the contents of the directory
    *but not the folder name. In a hacky way I rebuild the foldername. Could be better"**/
    let folderDepthArr = $scope.projectDir.split('/');
    let folderName = '/' + folderDepthArr[folderDepthArr.length - 1]
    fse.copy($scope.projectDir, path.resolve(__dirname + `/../projectFolder` + folderName), (err) => {
      if (err) return console.error(err);
      console.log('copied folder to local directory')
    })
  }

  function overwriteFileInProject(projectFolderName, fileName, data) {
    fs.writeFile(path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName), data, (err) => {
      if (err) return console.error(err);
      console.log('overwrote file at this path: \n', path.resolve(__dirname + `/../projectFolder` + projectFolderName + fileName))
    })
  }

  return {
    init: initProjectFolder,
    copyProject: copyProjectToAppStorage,
    overwrite: overwriteFileInProject
  }
}