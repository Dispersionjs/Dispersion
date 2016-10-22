
describe('IpfsService', function () {
var ipfsService;
beforeEach(angular.mock.module('ipfsService'));

beforeEach(inject(function (_ipfsService_) {
        ipfsService = _ipfsService_;
    }));

  it('should be', function () {
      expect(ipfsService).to.be.a('Object');
  });

})