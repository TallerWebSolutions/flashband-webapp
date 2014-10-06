module.exports = {
  create: function(req, res) {
    var showgoerParams = req.body;
    ShowgoerService.create(showgoerParams).then(res.created, function(ranson) {
      res.badRequest(ranson.message);
    });
  },

  summary: function(req, res) {
    Showgoer.count().exec(function(err, count) {
      if (err) return res.serverError(err);
      res.ok({total: count});
    });
  },

  index: function index (req, res) {
    res.ok([{
      name: "Showoger para Vinculação",
      doctype: "cpf",
      docnumber: "999.000.222-22"
    }]);
  },

  find: function(req, res) {
    res.ok({});
  }
};
