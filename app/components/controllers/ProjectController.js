angular.module('ProjectController', [])
  .controller('ProjectController', ['$http', 'ProjectService', '$scope', projectController]);

function projectController($http, ProjectService, $scope) {
  const self = this;
  self.projectArray = ProjectService.projectArray;
  self.publishedVersions = ProjectService.publishedProjectVersions;
  self.selectedVersion = ProjectService.selectedVersion;
  self.currentFile = ProjectService.currentFile;//function
  self.currentUrl = ProjectService.currentUrl; //function

  self.filesList = ProjectService.selectedVersionFilesList;//function
  self.fileVersions = ProjectService.fileChangedVersions; //function
  self.mediaContentUrl = '';
  self.showIframe = false;
  self.showEditor = false;
  self.showMedia = false;
  self.showFiles = false;
  self.lastProjectIndex = null;
  self.fileContentViewIndex = null;
  self.currentlySelectedFile = null;

  self.setFileContentViewIndex = (index) => {
    self.fileContentViewIndex = index;
  }
  self.changeCurrentlySelectedFile = (fileName, index = 0) => {

    if (self.fileContentViewIndex === null || self.currentlySelectedFile !== fileName) {
      self.showEditor = true;
    } else {
      self.showEditor = false;
    }
    self.setFileContentViewIndex(index);
    return self.currentlySelectedFile = fileName;
  }

  self.toggleShowFiles = (index) => {
    self.showFiles = self.lastVersionIndex === undefined || index !== self.lastVersionIndex ? true : !self.showFiles;
    self.lastVersionIndex = index;
  }
  self.getMediaContentUrl = () => self.mediaContentUrl;
  self.currentProject = ProjectService.currentProject;//function
  //clean this function up
  self.selectVersion = function (index) {
    ProjectService.changeSelectedVersion(index);
    // if (self.showIframe && self.lastProjectIndex !== null && index === self.lastProjectIndex) {
    //   // if (self.showIframe && self.lastProjectIndex !== null && index === self.lastProjectIndex) {
    //   self.showIframe = false;
    // } else {
    //   self.showIframe = true;
    // }
    self.lastProjectIndex = index;
  }
  self.getMode = function (filename) {
    let textTester = /(\.html$)|(\.js$)|(\.css$)|(\.txt$)|(\.json$)|(\.md$)|(\.log$)/gmi;
    let text = textTester.test(filename);
    return text ? self.getAceMode(filename.split('.').pop()) : false;
  }
  self.getAceMode = function (ext) {
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      default:
        return '';
    }
  }
  self.isImage = (file) => {
    let imageTester = /(\.jpeg$)|(\.jpg$)|(\.png$)|(\.gif$)|(\.json$)|(\.md$)|(\.log$)/i;
    return imageTester.test(file);
  }
  self.modalTrigger = function () {
    console.log('in modalTrigger')
    $('#projectModal').openModal()
  }
}
