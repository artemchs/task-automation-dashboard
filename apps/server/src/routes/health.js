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
      try {
        // Check Prisma connection
        await app.prisma.$queryRaw`SELECT 1`
        // Check Redis connection
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
      }
    }
  )
}
