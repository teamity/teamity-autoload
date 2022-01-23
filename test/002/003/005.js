module.exports = async function (teamity, opts) {
  teamity.decorate('field', 1)

  teamity.route({
    url: '005',
    handler () {}
  })

  teamity.route({
    url: '015',
    handler () {}
  })
}
