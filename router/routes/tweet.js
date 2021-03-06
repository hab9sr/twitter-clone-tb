var router = require('express').Router()
, ensureAuthentication = require('../../middleware/ensureAuthentication')
, Tweet = require('../../db').model('Tweet')

// get a user's tweets using query string parameter (QSP) userID
router.get('/', function(req, res) {
	var query
	switch (req.query.stream) {
		case 'profile_timeline':
			if (!req.query.userId) return res.sendStatus(400)
			query = { userId: req.query.userId }; break
		case 'home_timeline':
			query = { userId : { $in: req.user.followingIds } }; break
		default:
			res.sendStatus(400)
	}
	
	var options = { sort: { created: -1} }
	Tweet.find(query, null, options, function(err, tweets) {
		if (err) return res.sendStatus(500)
		var responseTweets = tweets.map(function(tweet) {
			return tweet.toClient()
		})

		res.send({ tweets: 	responseTweets })
	})
})

// post a tweet
router.post('/', ensureAuthentication, function(req, res) {
	var tweetData = req.body.tweet
	tweetData.created = Date.now() / 1000 | 0
	tweetData.userId = req.user.id

	Tweet.create(tweetData, function(err, tweet) {
		if (err) return res.sendStatus(500)
		res.send({ tweet: tweet.toClient() })
	})
})

// get tweet by id
router.get('/:tweetId', function(req, res) {
	Tweet.findById(req.params.tweetId, function(err, tweet) {
		if (err) return res.sendStatus(500)
		tweet ? res.send({ tweet: tweet.toClient() }) : res.sendStatus(404)
	})
})

// delete tweet by id
router.delete('/:tweetId', ensureAuthentication, function(req, res) {
	Tweet.findById(req.params.tweetId, function(err, tweet) {
		if (err) return res.sendStatus(500)
		if (!tweet) return res.sendStatus(404)
		if (tweet.userId !== req.user.id) return res.sendStatus(403)

		Tweet.findByIdAndRemove(tweet.id, function(err, removed) {
			res.sendStatus(err ? 500 : 200)
		})
	})
})

module.exports = router