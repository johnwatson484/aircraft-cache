const amqp = require('amqplib')
const { message } = require('./config')
const cache = require('./cache')
const { v4: uuidv4 } = require('uuid')

const subscribe = async (aircraft) => {
  const { host, port, username, password, exchange, queue } = message
  const connection = await amqp.connect(`amqp://${username}:${password}@${host}:${port}`)
  const channel = await connection.createChannel()
  await channel.assertExchange(exchange, 'fanout', {
    durable: true
  })

  const q = await channel.assertQueue(queue)

  await channel.bindQueue(q.queue, exchange, '')
  console.log('Waiting for messages in %s.', q.queue)

  await channel.consume(q.queue, async function (msg) {
    if (msg.content) {
      console.log('%s', msg.content.toString())
      await cache.set(uuidv4(), msg.content.toString())
    }
  }, {
    noAck: true
  })
}

module.exports = {
  subscribe
}
