import { healthRoutes } from './health.js'
import { usersRoutes } from './users.js'

export async function registerRoutes(app) {
  app.register(healthRoutes, { prefix: '/health' })
  app.register(usersRoutes, { prefix: '/users' })
}
