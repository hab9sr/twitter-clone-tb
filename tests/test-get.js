process.env.NODE_ENV = 'test'

describe('Test GET request:', function() {

	it('respond w/ status code 404', function(done) {
		var request = require('supertest')
		, app = require('../index')

		request(app).get('/api/tweets/55231d90f4d19b49441c9cb9').expect(404, done)
	})
})