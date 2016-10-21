var Application = require('spectron').Application;
var assert = require('assert');
var path = require("path");
var appPath = path.resolve(__dirname, '../'); //require the whole thing
var electronPath = path.resolve(__dirname, '../node_modules/.bin/electron');
var expect = require('chai').expect;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
//require('fluentnode')
//var helpers = require('./global-setup')


describe('application launch', function () {
  this.timeout(10000)

  beforeEach(function () {
    this.app = new Application({
      path: electronPath,
      args: [appPath]
    })
    return this.app.start()
  })

  afterEach(function () {
    if (this.app && this.app.isRunning()) {
      return this.app.stop()
    }
  })

  it('shows an initial window', function () {
    return this.app.client.getWindowCount().then(function (count) {
      assert.equal(count, 1)
    })
  })
})