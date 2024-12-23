import { healthRoutes } from './health.js'

export async function registerRoutes(app) {
  app.register(healthRoutes, { prefix: '/health' })
}
