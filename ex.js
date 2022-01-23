const WebSocket = require('ws')
const Teamity = require('teamity')
const autoload = require('./index')
const path = require('path')

const teamity = Teamity({
  ajv: {
    removeAdditional: true
  }
})

teamity.route({
  url: 'hello',
  handler (scope, rep) {
    this.$logger.info(scope.$body)
    rep.send('world')
  }
})

teamity.register(async (ins, opts) => {
  const { $router } = ins
  $router.setDeserializer(function (rawData, done) {
    const raw = JSON.parse(rawData.toString())
    done(null, raw.url, raw.body)
  })
  $router.setSerializer(function (url, reply, attr, done) {
    const rawData = Buffer.from(
      JSON.stringify({
        url,
        reply,
        attr
      })
    )
    done(null, rawData)
  })
})

teamity.register(autoload, {
  dir: path.join(__dirname, 'test'),
  prefix: 'test',
  name: 'test'
})

teamity.addHook('onRoute', function (route) {
  // this.$logger.debug(`onRoute Hook: ${route.url}`)
})

teamity.addHook('onBeforeConnection', function (skt) {
  this.$logger.info(`onBeforeConnection name:${this.$name}  id:${skt.$id}`)
})

teamity.addHook('onAfterDisconnection', function (skt) {
  this.$logger.info(`onAfterDisconnection name:${this.$name}  id:${skt.$id}`)
})

teamity.addHook('onBeforeHandler', function (scope, rep) {
  this.$logger.info(`onBeforeHandler  url:${scope.$url}`)
})

teamity.addHook('onAfterDeserializer', function (url, body, attr) {
  this.$root.$logger.info(`onAfterDeserializer name:${this.$name}  url:${url}`)
})

teamity.addHook('onBeforeSerializer', function (url, reply, attr) {
  this.$root.$logger.info(`onBeforeSerializer name:${this.$name}  url:${url}`)
})

teamity.ready(err => {
  console.log({ err })

  const ws = new WebSocket('ws://127.0.0.1:7440/teamity')

  ws.on('open', function () {
    console.log('ws opend')

    const payload0 = {
      url: 'test.002.00A.qweqwe',
      body: {
        num: 'aaaa',
        a: 'testParams'
      }
    }
    ws.send(Buffer.from(JSON.stringify(payload0)))
    // const payload1 = {
    //   url: '/',
    //   body: {
    //     num: 'aaaa',
    //     a: 'testParams'
    //   }
    // }
    // ws.send(Buffer.from(JSON.stringify(payload1)))
  })

  ws.on('message', rawData => {
    console.log({
      message: rawData.toString('utf-8')
    })
  })
  ws.on('error', e => {
    console.log(e)
  })

  teamity.addHook('onClose', function () {
    ws.close()
  })
})
