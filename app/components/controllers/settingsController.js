angular
  .module('SettingsController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('SettingsController', ['IpfsService', SettingsController]);
function SettingsController(IpfsService) {
  const self = this;
  IpfsService.peerID().then(function (data) {
    console.log('peer', data)
    self.peerID = data[0]
    self.bootStrapList = data[1]
  })

  self.addPeer = function (address) {
    console.log('in addPeer')
    IpfsService.addPeer(address).then(function (data) {
       console.log(data)

    });
  }

}