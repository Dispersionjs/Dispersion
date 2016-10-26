
angular.module('ProjectService', [])
  .service('ProjectService', ['$http', '$q', 'PublishService', projectService]);


function projectService($http, $q, PublishService) {
  /**returns length -1  of currently selected project data array */
  const self = this;
  self.init = () => {
    $q((resolve, reject) => {
      storage.get('currentlyPublished', (error, data) => {
        if (error) reject(error);
        resolve(data);
      })
    })
  }
  // self.publishedArrayLength = () => self.publishedProjectVersions().length - 1;
  /** returns all published event objects from the projectArray history */
  self.publishedProjectVersions = () => {
    if (!PublishService.data || !PublishService.data[self.selected]) return [];
    return PublishService.data[self.selected].filter((pubObj) => {
      return pubObj.publish === true;
    })
  }

  /** returns the url of the currently selected project version */
  self.currentUrl = (file) => {
    if (!file) {
      return self.selectedVersion.url;
    } else {
      return self.selectedVersion.url
    }
  }


  //should refactor self one \/  
  /** returns a string that was the last changed file of the publish event */
  // self.currentFile = () => self.selectedVersion.changed;
  // self.currentFileType = () => self.currentFile();

  self.changeSelectedVersion = (index) => {
    //will need to change to account for unpublished projects
    //
    self.currentIndex = index;
    // self.selectedVersion = self.publishedProjectVersions.length === 1 ? self.publishedProjectVersions()[self.publishedArrayLength() - index] : null;

  }

  self.getContentUrl = () => {
    return self.currentUrl() + self.currentFile();
  }
  self.changeSelectedProject = (projectName) => { self.selected = projectName }
  self.currentIndex = 0;
  self.selectedVersionFilesList = () => self.selectedVersion().files;
  self.selected = '';
  self.currentProject = () => self.selected;
  self.selectedVersion = () => {
    if (!self.publishedProjectVersions()) return [];
    return self.publishedProjectVersions()[self.currentIndex];
  }
}