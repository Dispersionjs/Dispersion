  var IpfsService;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('IpfsService'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_IpfsService_) {
    IpfsService = _IpfsService_;
  }));

  // A simple test to verify the Users factory exists
  it('should exist', function() {
    expect(IpfsService).toBeDefined();
  });