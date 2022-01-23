module.exports = async function (teamity, opts) {
  teamity.decorate('field', 2)

  teamity.route({
    url: '007',
    handler () {}
  })

  teamity.route({
    url: '017',
    handler () {}
  })
}
