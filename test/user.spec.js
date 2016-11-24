var request = require('supertest')
var expect = require('chai').expect
var path = require('path')
var app = require('../lib/index')(path.join(__dirname, '../example'), false)

describe('API test', function() {
  it('users:query', function(done) {
    request(app)
      .get('/api/users')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.page).to.be.not.undefined
        expect(res.body.page.total).to.least(20).below(40)
        expect(res.body.page.hasNext).to.be.not.undefined
        expect(res.body.results).to.be.instanceof(Array)
        expect(res.body.results[0].id).to.is.a('string')
        expect(res.body.results[0].nickname).to.is.a('string')
        expect(res.body.results[0].username).to.is.a('string')
        expect(res.body.results[0].email).to.is.a('string')
        done()
      })
  })

  it('users:get', function(done) {
    request(app)
      .get('/api/users/some_id')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body.id).to.is.a('string')
        expect(res.body.nickname).to.is.a('string')
        expect(res.body.username).to.is.a('string')
        expect(res.body.email).to.is.a('string')
        done()
      })
  })

  it('users:create', function(done) {
    request(app)
      .post('/api/users')
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('users:update', function(done) {
    request(app)
      .put('/api/users/some_id')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('users:delete', function(done) {
    request(app)
      .delete('/api/users/some_id')
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })

  it('users:change_password', function(done) {
    request(app)
      .post('/api/users/change_password')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        done()
      })
  })
})
