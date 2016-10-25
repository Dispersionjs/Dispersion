
angular
  .module('MainController', [])
  //passing $scope and UserFactory as dependencies to controller
  .controller('MainController', ['$scope', 'PublishService', 'FileFactory', 'DiskFactory', 'IpfsService', '$timeout', mainController]);

function mainController($scope, PublishService, FileFactory, DiskFactory, IpfsService, $timeout) {
  //load publish object when switching to publish page
  const self = this;
  let secondAttempt = false;
  self.startApp = () => {
    IpfsService.init()
      .then((daemonStatus) => {
        self.daemonStatus = daemonStatus;
        return FileFactory.init()
      })
      .then(DiskFactory.init)
      .then(PublishService.init)
      .then(() => {
        $timeout(() => {
          self.view = 'files';
        }, 500);
      })
      .catch((error) => {
        // $timeout(() => {
        //   if (error && self.view !== 'files' && !secondAttempt) {
        //     secondAttempt = true;
        //     console.log('error in mainController.startApp, will attempt retry');
        //   } else {
        //     console.log('unable to load')
        //     //add error view
        //   }
        // }, 5000);
        console.error(error);

      });
  }
  // PublishService.init().then(

  // )
  // IpfsService.init().then((data) => {

  //   console.log('daemondata', data)
  //   self.daemonStatus = data;
  // });
  // DiskFactory.init();
  // FileFactory.init();
  // self.view = 'files';
  self.startApp();
}

