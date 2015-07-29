var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, fixtures = require('./fixtures')
	, _ = require('lodash')
	, User = require('./db').model('User')
	, bcrypt = require('bcrypt')

passport.serializeUser(function(user, done) {
	done(null, user.id)
})

passport.deserializeUser(function(id, done) {
	User.findOne({ id: id }, function(err, user) {
		user ? done(null, user) : done(null, false)
	})
})

passport.use(new LocalStrategy(function(username, password, done) {
	User.findOne({ id: username }, function(err, user) {
		if (!user)
			return done(null, false, { message: 'Incorrect username' })
		bcrypt.compare(password, user.password, function(err, same) {
			if (err)
				return done(err)
			same? done(null, user)
				: done(null, false, { message: 'Incorrect password' })
		})
	})
}))

module.exports = passport