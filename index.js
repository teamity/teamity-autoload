const loader = require('beanify-autoload')

module.exports = async function (teamity, opts) {
  const options = { ...opts, urlPrefix: '/', pathSplit: '/' }

  teamity.register(loader, options)
}

module.exports.route = function (route) {
  return loader.route(route)
}
