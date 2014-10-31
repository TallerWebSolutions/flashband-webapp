'use strict';

var getFlashbandArgs = function(req) {
  return {
    tag: req.param('tag'),
    zone: req.param('zone')
  };
};

var inputSuccessful  = function(showgoer) { return {door: 'in',  message: 'Input successful.', showgoer: showgoer}; };
var outputSuccessful = function(showgoer) { return {door: 'out', message: 'Output successful.', showgoer: showgoer}; };

module.exports = {
  enter: function(req, res) {
    var args = getFlashbandArgs(req);
    FrontdoorService.registerEnter(args).then(function(entrance) {
      var response = inputSuccessful(entrance.showgoer);
      sails.io.sockets.emit('frontdoor:enter', response);
      res.created(response);
    }).fail(function(reason) {
      res.forbidden(reason.message);
    });
  },

  leave: function(req, res) {
    var args = getFlashbandArgs(req);
    FrontdoorService.registerLeave(args).then(function(entrance) {
      var response = outputSuccessful(entrance.showgoer);
      sails.io.sockets.emit('frontdoor:leave', response);
      res.created(response);
    }).fail(function(reason) {
      res.forbidden(reason.message);
    });
  },

  cross: function(req, res) {
    var args = getFlashbandArgs(req);
    FrontdoorService.checkRegistered(args).then(function (inside) {
      module.exports[inside ? 'leave' : 'enter'](req, res);
    }).fail(function(reason) {
      res.forbidden(reason.message);
    });
  }
};
