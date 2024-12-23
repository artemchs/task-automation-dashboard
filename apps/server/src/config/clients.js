import postgres from '@fastify/postgres'
import redis from '@fastify/redis'

export async function configureClients(app) {
  // PostgreSQL setup
  await app.register(postgres, {
    connectionString: app.config.DATABASE_URL,
  })

  // Redis setup with improved configuration
  await app.register(redis, {
    url: app.config.REDIS_URL,
    closeClient: true,
    connectTimeout: 5000, // 5 second timeout
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    retry_strategy: function (options) {
      if (options.total_retry_time > 1000 * 10) {
        // 10 seconds
        return new Error('Redis retry time exhausted')
      }
      return Math.min(options.attempt * 100, 3000)
    },
  })

  // Add error handlers
  app.redis.on('error', (err) => {
    app.log.error('Redis Client Error:', err)
  })

  app.redis.on('connect', () => {
    app.log.info('Redis Client Connected')
  })
}
