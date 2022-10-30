
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lastwhisper-discord-bot.cjs.production.min.js')
} else {
  module.exports = require('./lastwhisper-discord-bot.cjs.development.js')
}
