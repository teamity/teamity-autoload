module.exports = async function (teamity, opts) {
  teamity.decorate('field', 3)

  teamity.route({
    url: '004',
    handler () {}
  })
}
