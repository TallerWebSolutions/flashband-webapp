'use strict';

var expect = require('chai').use(require('chai-as-promised')).expect;
var dbHelp = require('../../../helpers/DatabaseHelper');
var fbHelp = require('../../../helpers/FlashbandHelper');

describe('FrontdoorService', function() {
  describe('#register', function() {
    beforeEach(function(done) {
      dbHelp.emptyModels([Entrance]).finally(done);
    });

    it('should create an Entrance', function (done) {
      fbHelp.createAssociated().then(function verifyRegisterEntrance(flashband) {
        var promisedEntrance = FrontdoorService.registerEnter({tag: flashband.tag, zone: '1'});
        expect(promisedEntrance).to.eventually.have.property('entrance').that.have.property('tag', flashband.tag).and.notify(done);
      }, done);
    });

    it('should not register entrance when non existing flashband', function (done) {
      expect(FrontdoorService.registerEnter({tag: '5678', zone: '1'})).to.be.rejectedWith('Flashband not found.').and.notify(done);
    });
  });
});
