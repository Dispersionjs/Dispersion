var benv = require('benv');



describe('calc module', function () {
  beforeEach(function setupEnvironment(done) {
    benv.setup(function () {
      benv.expose({
        angular: benv.require('../node_modules/angular/angular.js', 'angular')
      });
      done();
    });
  });
  // more stuff will go here
  afterEach(function destroySyntheticBrowser() {
    console.log("distroy")
    benv.teardown(true);
  });
});

console.log("In IPFS test!")