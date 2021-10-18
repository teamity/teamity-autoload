const loader = require('smallify-autoload')

module.exports = async function (teamity, opts) {
  teamity.register(loader, opts)
}

module.exports.route = function (route) {
  return loader.route(route)
}
