var expect = require('chai').use(require('chai-as-promised')).expect;
var async = require('async');
//var FlashbandHelper = require('../../helpers/FlashbandHelper');

describe('FlashbandService', function() {
  describe('#enable', function() {
    beforeEach(function(done) {
      async.each([Flashband, FlashbandBatch], function(model, next) {
        model.drop();
        next();
      }, done);
    });

    it('should associate flashband in', function(done) {
      var expectAssociation = function(flashbandBatch) {
        FlashbandBatch.findOne(flashbandBatch.id).populate('flashbands').then(function(saved) {
          expect(saved).to.be.ok;
          expect(saved.flashbands).to.have.length(1, 'wrong number of associated flashbands');
          expect(saved.flashbands[0]).to.have.property('tag', '123456');
          FlashbandBatch.findOne(flashbandBatch.id).then(function(flashbandBatch) {
            expect(flashbandBatch).to.not.have.property('flashbands');
          });
          done();
        }).fail(done);
      };
      FlashbandService.enable([ {tag: '123456', serial: 1} ], 'lote 1')
        .then(function() {
          FlashbandBatch.findOne({name:'lote 1'}).then(expectAssociation).fail(done);
        })
      .fail(done);
    });
    it('should ensure use waterline association FlashbandBatch -> Flashband', function(done) {
      FlashbandService.enable([{ tag: '123456', serial: 1 }], 'lote 1', 'batch-file-content')
        .then(function() {
          FlashbandBatch.findOne({name:'lote 1'}).then(function(flashbandBatch) {
            expect(flashbandBatch.flashbands).to.have.length(0);
            done();
          }).fail(done);
        }).fail(done);
    });
    it('should save received batch file', function(done) {
      FlashbandService.enable([{ tag: '123456', serial: 1 }], 'lote 1', 'batch-file-content')
        .then(function() {
          FlashbandBatch.findOne({name:'lote 1'}).then(function(flashbandBatch) {
            expect(flashbandBatch).to.have.property('file', 'batch-file-content');
            done();
          }).fail(done);
        }).fail(done);
    });
    it('should reject existing flashbands');
    it('should reject duplcated flashbands');
    it('should disable prior active flashband batch');
    it('should destroy existing flashbands');
  });
});