const testData = {
  "Dispersion": [
    {
      "date": "2016-10-14T18:22:23.133Z",
      "hash": "QmehudYxpxDW3egZraNvq7MKEXzky8GLRcxJ6VbmpUcbxV",
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
    if (!PublishService.data) return [];
    return PublishService.data[self.selected]
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
  self.currentIndex = 0;
  self.selectedVersionFilesList = () => self.selectedVersion().files;
  self.selected = 'test';
  self.currentProject = () => self.selected;
  self.selectedVersion = () => {
    if (!self.publishedProjectVersions()) return [];
    return self.publishedProjectVersions()[self.currentIndex];
  }
}