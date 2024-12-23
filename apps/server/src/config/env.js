import env from '@fastify/env'

export async function configureEnv(app) {
  const schema = {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: {
      DATABASE_URL: {
        type: 'string',
        default: 'postgres://postgres:postgres@localhost:5432/fastdev',
      },
      REDIS_URL: {
        type: 'string',
        default: 'redis://localhost:6379',
      },
    },
  }

  await app.register(env, {
    schema,
    dotenv: true,
  })
}
