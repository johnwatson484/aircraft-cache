const amqp = require('amqplib/callback_api')
const { message } = require('./config')
const cache = require('./cache')
const { v4: uuidv4 } = require('uuid')

const subscribe = async (aircraft) => {
  const { host, port, username, password, exchange } = message
  amqp.connect(`amqp://${username}:${password}@${host}:${port}/`, function (error0, connection) {
    if (error0) {
      throw error0
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1
      }

      channel.assertExchange(exchange, 'fanout', {
        durable: false
      })

      channel.assertQueue('', {
        exclusive: true
      }, function (error2, q) {
        if (error2) {
          throw error2
        }
        console.log(' [*] Waiting for messages in %s.', q.queue)
        channel.bindQueue(q.queue, exchange, '')

        channel.consume(q.queue, async function (msg) {
          if (msg.content) {
            console.log(' [x] %s', msg.content.toString())
            await cache.set(uuidv4(), msg.content)
          }
        }, {
          noAck: true
        })
      })
    })
  })
}

module.exports = {
  subscribe
}
