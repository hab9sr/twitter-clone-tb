var router = require('express').Router()
, passport = require('passport')

// login
router.post('/login', function(req, res) {
	passport.authenticate('local', function(err, user, info) {
		if (err) return res.sendStatus(500)
		if (!user) return res.sendStatus(403)

		req.logIn(user, function(err) {
			err ? res.sendStatus(500) : res.send({ user: user.toClient() })
		})
	})(req, res)
})

// logout
router.post('/logout', function(req, res) {
	req.logout()
	res.sendStatus(200)
})

module.exports = router