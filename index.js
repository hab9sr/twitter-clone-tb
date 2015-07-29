// middleware
var ensureAuthentication = require('./middleware/ensureAuthentication')

// server setup
var config = require('./config')
, app = require('express')()
require('./middleware')(app)
require('./router')(app)

module.exports = app.listen(config.get('server:port'), config.get('server:host'))