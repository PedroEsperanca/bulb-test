var should = require('should');
var request = require('supertest');
var server = require('../../../app');

var userId = '';

describe('controllers', function() {

  describe('user', function() {

    describe('GET /user', function() {

      it('should get an array of users', function(done) {

        request(server)
          .get('/user')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            (res.body.users.length > 0).should.be.true();

            done();
          });
      });

    });

    describe('POST /user', function() {

      it('should add a user', function(done) {

        request(server)
          .post('/user')
          .set('Accept', 'application/json')
          .send({
            "firstname": "test first name",
            "lastname": "test last name",
            "email": "testemail@email.com"
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            userId = res.body.object.id;

            res.body.success.should.eql(1);
            res.body.description.should.eql('User added to the list!');
            should.exist(res.body.object.id);
            res.body.object.firstname.should.eql('test first name');
            res.body.object.lastname.should.eql('test last name');
            res.body.object.email.should.eql('testemail@email.com');

            done();
          });
      });

    });

    describe('GET /user/:id', function() {

      it('should return a user', function(done) {

        request(server)
          .get('/user/'+userId)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            // console.log(userId);

            res.body.id.should.eql(userId);
            res.body.firstname.should.eql('test first name');
            res.body.lastname.should.eql('test last name');
            res.body.email.should.eql('testemail@email.com');

            done();
          });
      });

    });

    describe('PUT /user/:id', function() {

      it('should update a user', function(done) {

        request(server)
          .put('/user/'+userId)
          .set('Accept', 'application/json')
          .send({
            "firstname": "test first name updated",
            "lastname": "test last name updated",
            "email": "testemailupdated@email.com"
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.success.should.eql(1);
            res.body.description.should.eql('User updated!');
            res.body.object.id.should.eql(userId);
            res.body.object.firstname.should.eql('test first name updated');
            res.body.object.lastname.should.eql('test last name updated');
            res.body.object.email.should.eql('testemailupdated@email.com');

            done();
          });
      });

    });

    describe('DELETE /user/:id', function() {

      it('should delete a user', function(done) {

        request(server)
          .delete('/user/'+userId)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.success.should.eql(1);
            res.body.description.should.eql('User deleted!');
            res.body.object.id.should.eql(userId);
            res.body.object.firstname.should.eql('test first name updated');
            res.body.object.lastname.should.eql('test last name updated');
            res.body.object.email.should.eql('testemailupdated@email.com');

            done();
          });
      });

    });

  });

});
