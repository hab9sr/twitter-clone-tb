var router = require('express').Router()
, ensureAuthentication = require('../../middleware/ensureAuthentication')
, User = require('../../db').model('User')

// get a user by id
router.get('/:userId', function(req, res) {
	User.findOne({ id: req.params.userId }, function(err, user) {
		if (err) return res.sendStatus(500)
		user ? res.send({ user: user.toClient() }) : res.sendStatus(404)
	})
})

// add a user
router.post('/', function(req, res) {
	User.create(req.body.user, function(err, user) {
	    if (err)
			return res.sendStatus(err.code === 11000 ? 409 : 500)
	    req.login(user, function(err) {
			res.sendStatus(err ? 500 : 200)
	    })
	})  
})

// change password
router.put('/:userId', ensureAuthentication, function(req, res) {
	var id = req.params.userId
	if (id !== req.user.id)
		return res.sendStatus(403)

	var query = { id: id }
	, update = { $set: { password: req.body.password }}
	User.findOneAndUpdate(query, update, function(err, user) {
		res.sendStatus(err ? 500 : 200)
	})
})

// follow user
router.post('/:userId/follow', ensureAuthentication, function(req, res) {
	User.findByUserId(req.params.userId, function(err, user) {
		if (err) return res.sendStatus(500)
		if (!user) return res.sendStatus(403)

		req.user.follow(user.id, function(err) {
			res.sendStatus(err ? 500 : 200)
		})
	})
})

// unfollow user
router.post('/:userId/unfollow', ensureAuthentication, function(req, res) {
	User.findByUserId(req.params.userId, function(err, user) {
		if (err) return res.sendStatus(500)

		req.user.unfollow(user.id, function(err) {
			res.sendStatus(err ? 500 : 200)
		})
	})
})

// get friends
router.get('/:userId/friends', ensureAuthentication, function(req, res) {
	User.findByUserId(req.params.userId, function(err, user) {
		if (err) return res.sendStatus(500)
		if (!user) return res.sendStatus(404)

		user.getFriends(function(err, friends) {
			if (err) return res.sendStatus(500)
			var friendsClient = friends.map(function(user) {
				return user.toClient()
			})
			res.send({ users: friendsClient })
		})
	})
})

// get followers
router.get('/:userId/followers', ensureAuthentication, function(req, res) {
	User.findByUserId(req.params.userId, function(err, user) {
		if (err) return res.sendStatus(500)
		if (!user) return res.sendStatus(404)

		user.getFollowers(function(err, followers) {
			if (err) return res.sendStatus(500)
			var followersClient = followers.map(function(user) {
				return user.toClient()
			})
			res.send({ users: followersClient })
		})
	})
})

module.exports = router