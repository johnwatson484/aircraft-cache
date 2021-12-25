const cache = require('./cache')
const subscribe = require('./subscribe')

const main = async () => {
  await cache.start()
  await subscribe()
}

main()
