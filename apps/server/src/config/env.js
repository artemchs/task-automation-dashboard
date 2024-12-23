import env from '@fastify/env'

export async function configureEnv(app) {
  const schema = {
    type: 'object',
    required: ['DATABASE_URL', 'REDIS_URL', 'JWT_SECRET'],
    properties: {
      DATABASE_URL: {
        type: 'string',
        default: 'postgres://postgres:postgres@localhost:5432/fastdev',
      },
      REDIS_URL: {
        type: 'string',
        default: 'redis://localhost:6379',
      },
      JWT_SECRET: {
        type: 'string',
        default: 'supersecret',
      },
    },
  }

  await app.register(env, {
    schema,
    dotenv: true,
  })
}
