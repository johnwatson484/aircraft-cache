const { cache } = require('../config')
const { createClient } = require('redis')
let client

const start = async () => {
  client = createClient({ socket: cache.socket, password: cache.password })
  client.on('error', (err) => console.log(`Redis error: ${err}`))
  client.on('reconnecting', () => console.log('Redis reconnecting...'))
  client.on('ready', () => console.log('Redis connected'))
  await client.connect()
}

const stop = async () => {
  await client.disconnect()
}

const set = async (key, value) => {
  const fullKey = getFullKey(key)
  const serializedValue = JSON.stringify(value)
  await client.set(fullKey, serializedValue)
  await client.expire(fullKey, cache.ttl)
}

const getFullKey = (key) => {
  const prefix = getKeyPrefix()
  return `${prefix}:${key}`
}

const getKeyPrefix = () => {
  return `${cache.partition}`
}

module.exports = {
  start,
  stop,
  set
}
