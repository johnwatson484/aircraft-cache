const amqp = require('amqplib')
const { message } = require('./config')
const cache = require('./cache')
let connection
let channel

const start = async (aircraft) => {
  const { host, port, username, password, exchange, queue } = message
  connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
  channel = await connection.createChannel()
  await channel.assertExchange(exchange, 'fanout', {
    durable: true
  })

  const q = await channel.assertQueue(queue)

  await channel.bindQueue(q.queue, exchange, '')
  console.log('Waiting for messages in %s.', q.queue)

  await channel.consume(q.queue, async function (msg) {
    if (msg.content) {
      const body = JSON.parse(msg.content.toString())
      console.log('%s', body)
      await cache.set(body.callSign, msg.content.toString())
    }
  }, {
    noAck: true
  })
}

const stop = async () => {
  await channel.close()
  await connection.close()
}

module.exports = {
  start,
  stop
}
