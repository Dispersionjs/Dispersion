
angular.module('ProjectService', [])
  .service('ProjectService', ['$http', '$q', projectService]);


function projectService($http, $q) {
  /**returns length -1  of currently selected project data array */
  this.projectArrayLength = () => this.projectArray.length - 1;
  this.publishedArrayLength = () => this.publishedProjectVersions().length - 1;
  /** returns all published event objects from the projectArray history */
  this.publishedProjectVersions = () => {
    return this.projectArray.filter((version) => {
      return version.publish
    });
  }

  /** returns the url of the currently selected project version */
  this.currentUrl = (file) => {
    if (!file) {
      return this.selectedVersion.url;
    } else {
      return this.selectedVersion.url
    }
  }


  //should refactor this one \/  
  /** returns a string that was the last changed file of the publish event */
  this.currentFile = () => this.selectedVersion.changed;

  this.currentFileType = () => this.currentFile();

  this.changeSelectedVersion = (index) => {
    //will need to change to account for unpublished projects
    this.selectedVersion = this.publishedProjectVersions()[this.publishedArrayLength() - index];
    // console.log('this.selctedversion: ', this.selectedVersion);
    // this.currentUrl = this.selectedVersion.url;
    // console.log('this.currenturl: ', this.currentUrl());
    // this.currentFile = this.selectedVersion.changed;
    // console.log('this.currentFile: ', this.currentFile());
  }

  this.getContentUrl = () => {
    return this.currentUrl() + this.currentFile();
  }
  this.selectedVersionFilesList = () => this.selectedVersion.files;
  this.data = testData
  this.publishedProject = 'Dispersion';
  this.currentProject = () => this.publishedProject;
  this.projectArray = this.data[this.publishedProject];
  this.newestVersion = this.projectArray[this.projectArrayLength()];
  this.selectedVersion = this.newestVersion;

  // this.editorContent = this.currentProjectVersion;

}