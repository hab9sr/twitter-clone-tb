var nconf = require('nconf')
, path = require('path')

var phase = process.env.NODE_ENV
var configFile = 'config-' + phase + '.json'

nconf.file(path.join(__dirname, configFile))

module.exports = nconf
