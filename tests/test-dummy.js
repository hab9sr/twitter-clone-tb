var fs = require('fs')

describe('Simple tests', function() {

	it('check if dummy file exists', function(done) {
		fs.exists('dummy', function(exists) {
			done(exists ? null : new Error('File doesn\'t exist'))
		})
	})
})