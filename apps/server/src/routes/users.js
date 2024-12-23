import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

const userResponse = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    email: { type: 'string', format: 'email' },
    token: { type: 'string' },
  },
}

const errorResponse = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
}

/**
 * @typedef {Object} UserPayload
 * @property {number} id - User ID
 * @property {string} email - User email
 * @property {string} name - User name
 */

/**
 * Configure user-related routes
 * @param {import('fastify').FastifyInstance} app - Fastify instance
 */
export async function usersRoutes(app) {
  app.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
          },
        },
        response: {
          200: userResponse,
          400: errorResponse,
        },
      },
    },
    async (req, res) => {
      const { email, password, name } = req.body

      const exists = await app.prisma.user.findUnique({ where: { email } })
      if (exists) return res.status(400).send({ error: 'User exists' })

      const passwordHash = await hash(password, 10)
      const user = await app.prisma.user.create({
        data: { email, passwordHash, name },
      })

      const token = await generateToken(app, {
        id: user.id,
        email: user.email,
        name: user.name,
      })

      return { id: user.id, email: user.email, token }
    }
  )

  app.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        response: {
          200: userResponse,
          400: errorResponse,
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body

      const user = await app.prisma.user.findUnique({ where: { email } })
      if (!user) return res.status(400).send({ error: 'User not found' })

      const valid = await compare(password, user.passwordhash)
      if (!valid) return res.status(400).send({ error: 'Invalid password' })

      const token = await generateToken(app, {
        id: user.id,
        email: user.email,
        name: user.name,
      })

      return { id: user.id, email: user.email, token }
    }
  )

  app.post(
    '/logout',
    {
      onRequest: [app.authenticate],
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
            },
          },
          401: errorResponse,
        },
      },
    },
    async (req) => {
      await app.redis.del(`session:${req.token}`)

      return { success: true }
    }
  )
}

/**
 * Generate JWT token and store in Redis
 * @param {import('fastify').FastifyInstance} app - Fastify instance
 * @param {UserPayload} payload - User data to encode in token
 * @returns {Promise<string>} Generated token
 */
async function generateToken(app, payload) {
  const token = jwt.sign(payload, app.config.JWT_SECRET, {
    expiresIn: '1 day',
  })

  await app.redis.set(`session:${token}`, JSON.stringify(payload), 'EX', 86400)

  return token
}
