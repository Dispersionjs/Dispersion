angular
  .module('SettingsController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('SettingsController', ['IpfsService', SettingsController]);
function SettingsController(IpfsService) {
  const self = this;
  IpfsService.peerID().then(function (data) {
    self.peerID = data[0]
    self.bootStrapList = data[1]
  })

  self.addPeer = function (address) {
    IpfsService.addPeer(address).then(function (data) {
    });
  }
}