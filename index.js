const loader = require('beanify-autoload')

module.exports = async function (smallify, opts) {
  const options = { ...opts, urlPrefix: '/', pathSplit: '/' }

  smallify.register(loader, options)
}

module.exports.route = function (route) {
  return loader.route(route)
}
