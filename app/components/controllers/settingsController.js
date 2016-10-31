angular
  .module('SettingsController', [])
  //passing $scope and UserFactory as dependencies to controller

  .controller('SettingsController', ['IpfsService', SettingsController]);
function SettingsController(IpfsService) {
  const self = this;
  self.activated = true;
  self.loadConfig = function () {
    IpfsService.getSettingsInfo().then(function (data) {
      self.peerID = data[0]
      self.bootStrapList = data[1]
      self.multiAddr = data[2]
      self.ipfsVersion = data[3]
    })

  }
  self.hashPeers = false;
  self.checkHealth = function (hash) {
    IpfsService.findProviders(hash).then(function (data) {
      console.log('theData', data)
      self.health = data.length;
      self.hashPeers = true;
    })
  }

  self.addPeer = function (address) {
    IpfsService.addPeer(address).then(function (data) {
    });
  }
}