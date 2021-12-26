const cache = require('./cache')
const subscribe = require('./subscribe')

const main = async () => {
  await cache.start()
  await subscribe.start()
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await cache.stop()
    await subscribe.stop()
    process.exit()
  })
}

main()
