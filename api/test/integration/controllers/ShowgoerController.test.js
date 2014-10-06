var request      = require('supertest');
var passwordHash = require('password-hash');
var expect = require('chai').expect;
var ShowgoerHelper = require('../../helpers/ShowgoerHelper');
var databaseHelper = require('../../helpers/DatabaseHelper');

describe('ShowgoerController', function() {
  var serialToken;

  describe('with authenticated user', function() {
    beforeEach(function(done) {
      User.create({password: '123123123'}).exec(function(err, user) {
        if (err) return done(err);
        serialToken = passwordHash.generate(user.id);
        user.tokens.add({ token: serialToken });
        user.save().then(function() {
          databaseHelper.emptyModels([Showgoer]).then(done).fail(done);
          return;
        });
      });
    });

    describe('GET /showgoer', function() {
      it ('should be ok', function(done) {
        request(sails.hooks.http.app)
          .get('/showgoer/')
          .expect('Content-Type', /application\/json/)
          .expect(200)
          .set('Authorization', 'Token token='.concat(serialToken))
          .end(done);
      });

      it ('should list showgoers', function(done) {

        ShowgoerHelper.create().then(function() {
          request(sails.hooks.http.app)
            .get('/showgoer/')
            .set('Authorization', 'Token token='.concat(serialToken))
            .end(function(err, res) {
              if (err) return done(err);
              var showgoers = res.body;
              expect(showgoers).to.have.length(1);
              var showgoer = showgoers[0];
              expect(showgoer).to.have.property('name', 'Fulano de Tal');
              expect(showgoer).to.have.property('cpf', '111.111.111-11');
              expect(showgoer).to.have.property('id');
              expect(showgoer).to.have.property('createdAt');
              expect(showgoer).to.have.property('updatedAt');
              done();
            });
        }).fail(done);
      });
    });
  });
});
