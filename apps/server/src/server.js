import closeWithGrace from 'close-with-grace'
import { buildApp } from './app.js'

async function start() {
  const app = await buildApp({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  })

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    app.log.info('Server is running on http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

  // Graceful shutdown
  closeWithGrace({ delay: 500 }, async function ({ err }) {
    if (err) app.log.error(err)
    await app.close()
  })
}

start()
