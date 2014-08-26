var Q = require('q');
var chai = require('chai');
var args;
chai.should();
chai.use(require('chai-as-promised'));

describe('EntranceService', function() {
  describe('#checkRegistered', function() {
    beforeEach(function(done) {
      args = {flashband: '1234'};
      done();
    });

    it('should not register entrance when ShowGoer already in', function (done) {
      Entrance.create(args, function(err, entranceModel) {
        EntranceService.register(args.flashband).should.be.rejectedWith('Duplicated entrance.').notify(done);
      });
    });

    it('should register entrance when ShowGoer not already in', function (done) {
      var promised = EntranceService.register(args.flashband);
      Q.all([
        promised.should.eventually.have.property("id"),
        promised.should.eventually.have.property("flashband", args.flashband)
        ]).should.notify(function(err, results) {
          done();
        });
    });
  });
});
