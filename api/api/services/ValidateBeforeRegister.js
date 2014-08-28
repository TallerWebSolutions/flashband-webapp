var Q = require('q');

module.exports = function(flashbandUid) {
  var deferred = Q.defer();

  async.series({
    flashbandNotImported: function(callback){
      FlashbandService.exists(flashbandUid).then(function(exists) {
        callback(null, !exists);
      });
    },
    entranceAlreadyRegistered: function(callback) {
      FrontdoorService.checkRegistered(flashbandUid).then(function(registered) {
        callback(null, registered);
      });
    },
    blockedFlashband: function(callback) {
      Flashband.findOne({tag: flashbandUid}).then(function(flashband) {
        callback(null, flashband ? flashband.blocked() : false);
      });
    }
  }, function(err, results) {
    deferred.resolve(results);
  });

  return deferred.promise;
};