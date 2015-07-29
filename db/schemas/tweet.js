var Schema = require('mongoose').Schema
, _ = require('lodash')

var tweetSchema = new Schema({
    userId: String,
    created: Number,
    text: String
})

tweetSchema.methods.toClient = function() {
	var tweet = _.pick(this, ['text', 'created', 'userId'])
	tweet.id = this._id
	return tweet
}

module.exports = tweetSchema
