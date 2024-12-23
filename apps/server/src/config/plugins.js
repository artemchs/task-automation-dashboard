import cors from '@fastify/cors'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import rateLimit from '@fastify/rate-limit'

export async function configurePlugins(app) {
  // CORS
  await app.register(cors, {
    origin: true,
  })

  // Rate limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  // API documentation
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'FastDev API',
        description: 'API documentation',
        version: '0.1.0',
      },
    },
  })

  await app.register(swaggerUI, {
    routePrefix: '/docs',
  })
}
