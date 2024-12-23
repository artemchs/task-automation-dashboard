import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'

export default fp(async function (fastify) {
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      // Get token from Authorization header
      const authHeader = request.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('No token provided')
      }

      const token = authHeader.split(' ')[1]

      // Verify JWT
      const decoded = jwt.verify(token, fastify.config.JWT_SECRET)

      // Check if session exists in Redis
      const session = await fastify.redis.get(`session:${token}`)
      if (!session) {
        throw new Error('Invalid session')
      }

      // Add user data to request
      request.user = decoded
      request.token = token
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized', message: err.message })
    }
  })
})
