const { route } = require('../../../index')

module.exports = route({
  handler (scope, rep) {
    console.log(this.$teamity.field)
  }
})
