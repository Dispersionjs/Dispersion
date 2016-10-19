var module = angular
  .module('IpfsService', [])

module.factory('IpfsService', ['$q', ipfsService]);

function ipfsService($q) {

  function startDaemon() {
      console.log('hi DOOOOOOOOD');
      let daemonCommand = spawn('ipfs', ['daemon']);
      daemonCommand.stdout.on('data', function (data) {
        let dataString = data.toString();
        let result = /Daemon is ready/.test(dataString);
        if (result) {
          console.log('the daemon is running')
        }
      });
      daemonCommand.stderr.on('data', function (data) {
        let dataString = data.toString();
        let result = /daemon is running/.test(dataString);
        if (result) {
          console.log('Warning: Daemon already is running in a seperate process! Closing this application will not kill your IPFS Daemon.')
        }
      })
     return Dispersion;
  }
  

  return {
    init: startDaemon
  }
}