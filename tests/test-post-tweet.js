process.env.NODE_ENV = 'test'

var config = require('../config')
	, mongoose = require('mongoose')

describe('Test POST /api/tweets', function() {

	before(function(done) {
		var connection = mongoose.createConnection(
			config.get('database:host')
			, config.get('database:name')
			, config.get('database:port')
			, function(err) {
				if (err) return done(err)
				connection.db.dropDatabase(done)
			})
	})

	it('test case 1', function (done) {
		var request = require('supertest')
		, app = require('../index')

		request(app)
			.post('/api/tweets')
			.send({tweet: {text: 'test tweet', userId:'test'}})
			.expect(403, done)
	})

	it('test case 2', function(done) {
		var Session = require('supertest-session')({
			app: require('../index.js')
		})
		, chai = require('chai')
		, expect = chai.expect

		var session = new Session()
		, testUser = {
			id: 'test',
			name: 'Test',
			password: 'test',
			email: 'test@test.com'
		}

		session
			.post('/api/users')
			.send({user: testUser})
			.expect(200, function(err, response) {
				if (err) return done(err)
				session
					.post('/api/tweets')
					.send({tweet: {text: 'tweet'}})
					.expect(200)
					.end(function(err, response2) {
						try {
							expect(response2.body).to.have.property('tweet')
							done(null)
						} catch (err) {
							done(err)
						}
					})
			})
	})

})