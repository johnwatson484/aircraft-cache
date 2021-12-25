const cache = require('./cache')
const message = require('./message')

const main = async () => {
  await cache.start()
  await message.subscribe()
}

for (const signal of ['SIGINT', 'SIGTERM', 'SIGQUIT']) {
  process.on(signal, async () => {
    await cache.stop()
    process.exit()
  })
}

main()
