const testData = {
  "Dispersion": [
    {
      "date": "2016-10-14T18:22:23.133Z",
      "hash": "QmehudYxpxDW3egZraNvq7MKEXzky8GLRcxJ6VbmpUcbxV",
      "publish": true,
      "changed": "/smoke_trail.jpeg",
      "url": "https://ipfs.io/ipfs/QmehudYxpxDW3egZraNvq7MKEXzky8GLRcxJ6VbmpUcbxV",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css"
      ]
    },
    {
      "date": "2016-10-15T18:22:23.133Z",
      "hash": "QmPdqizZHVSKbCGkv6rXaotXwdwRC5jHQLUNy2niEfNg1o",
      "publish": true,
      "changed": "/styles.css",
      "url": "https://ipfs.io/ipfs/QmPdqizZHVSKbCGkv6rXaotXwdwRC5jHQLUNy2niEfNg1o",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    },
    {
      "date": "2016-10-16T18:22:23.133Z",
      "hash": "QmXEib3wKC3ZnNQGyLJdZJ5iPpmgoqoJyqPfLNdTRbwtUg",
      "publish": true,
      "changed": "/main.js",
      "url": "https://ipfs.io/ipfs/QmXEib3wKC3ZnNQGyLJdZJ5iPpmgoqoJyqPfLNdTRbwtUg",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    },
    {
      "date": "2016-10-17T18:22:23.133Z",
      "hash": "QmTG9nQUhYJdH5uraNyVdDftoTWDhBgPtTbdCp9x7Xawrx",
      "publish": true,
      "changed": "/index.html",
      "url": "https://ipfs.io/ipfs/QmTG9nQUhYJdH5uraNyVdDftoTWDhBgPtTbdCp9x7Xawrx",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    },
    {
      "date": "2016-10-18T18:22:23.133Z",
      "hash": "QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
      "publish": false,
      "changed": "/index.html",
      "url": "https://ipfs.io/ipfs/QmT45exg6ZEiCBxC4LfoVZPvPkzdtQvNqWxbF9CJN3Xnec",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    },
    {
      "date": "2016-10-19T18:22:23.133Z",
      "hash": "QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
      "publish": false,
      "changed": "/index.html",
      "url": "https://ipfs.io/ipfs/QmXtuj4RRhSNDxNpa2MKaea4sZ5GRprjvtrdaTH84pY9NC",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    },
    {
      "date": "2016-10-20T18:22:23.133Z",
      "hash": "QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY",
      "publish": false,
      "changed": "/index.html",
      "url": "https://ipfs.io/ipfs/QmWxnq9onYoNcsYjTpk1mcHTCU6bgmXBCALwkP7roP68HY",
      "files": [
        "/index.html",
        "/main.js",
        "/styles.css",
        "/smoke_trail.jpeg"
      ]
    }
  ]
}
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
  this.data = testData;
  this.publishedProject = 'Dispersion';
  this.currentProject = () => this.publishedProject;
  this.projectArray = this.data[this.publishedProject];
  this.newestVersion = this.projectArray[this.projectArrayLength()];
  this.selectedVersion = this.newestVersion;

  // this.editorContent = this.currentProjectVersion;

}