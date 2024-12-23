export async function healthRoutes(app) {
  app.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: { type: 'string' },
              postgres: { type: 'boolean' },
              redis: { type: 'boolean' },
              timestamp: { type: 'string' },
            },
          },
        },
      },
    },
    async () => {
      // Check database connections
      const pgClient = await app.pg.connect()
      try {
        await pgClient.query('SELECT 1')
        await app.redis.ping()

        return {
          status: 'healthy',
          postgres: true,
          redis: true,
          timestamp: new Date().toISOString(),
        }
      } catch (err) {
        app.log.error(err)
        return {
          status: 'unhealthy',
          postgres: false,
          redis: false,
          timestamp: new Date().toISOString(),
        }
      } finally {
        pgClient.release()
      }
    }
  )
}
