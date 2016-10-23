angular.module('FileHistoryFactory', [])
  .factory('FileHistoryFactory', ['ProjectService', fileHistoryFactory])

function fileHistoryFactory(ProjectService) {

  //TODO: function to add to object to project service array, should hook into file controller to make effective save event. it should: pass editorcontent data and file name, projectname, save file to project path, overwriting if necessay, then rehash, contstruct what we have before rrefered to as a "publish object" with publish set to false, add that to  project service array. then save the project service array to disk, 
  const historyArray = ProjectService.projectArray;
  /** takes in a file string, returns array of event objects that were files changes, not publish events */
  function fileVersionArray(file) {
    return historyArray.filter((version) => {
      if (file) {
        if (file[0] !== '/') file = '/' + file;
        return version.changed === file && version.files.includes(file);
      }
    });
  }
  function addFileVersion(obj) {
    ProjectService.projectArray.push(obj);
  }

  return {
    fileHistory: fileVersionArray,
    add: addFileVersion
  };
}