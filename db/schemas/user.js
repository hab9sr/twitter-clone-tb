var Schema = require('mongoose').Schema
, bcrypt = require('bcrypt')
, _ = require('lodash')

var userSchema = new Schema({
    id: { type: String, unique: true },
    name: String,
    email: { type: String, unique: true },
    password: String,
    followingIds: {type: [String], default: [] }
})

userSchema.pre('save', function(next) {
	var _this = this
	bcrypt.hash(this.password, 10, function(err, hash) {
		if (err) return next(err)
		_this.password = hash
		next()
	})
})

userSchema.methods.toClient = function() {
	return _.pick(this, ['id', 'name'])
}

userSchema.methods.follow = function(userId, done) {
	var update = { $addToSet: { followingIds: userId } }
	this.model('User').findByIdAndUpdate(this._id, update, done)
}

userSchema.methods.unfollow = function(userId, done) {
	var update = { $pull: { followingIds: userId } }
	this.model('User').findByIdAndUpdate(this._id, update, done)
}

userSchema.methods.getFriends = function(done) {
	this.model('User').find({ id: { $in: this.followingIds } }, done)
}

userSchema.methods.getFollowers = function(done) {
	this.model('User').find({ followingIds: { $in: [this.id] } }, done)
}

userSchema.statics.findByUserId = function(id, done) {
	this.findOne({ id: id }, done)
}

module.exports = userSchema