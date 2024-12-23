import Fastify from 'fastify'
import { configureEnv } from './config/env.js'
import { configureClients } from './config/clients.js'
import { configureHooks } from './config/hooks.js'
import { configurePlugins } from './config/plugins.js'
import { registerRoutes } from './routes/index.js'

export async function buildApp(opts = {}) {
  const app = Fastify(opts)

  // Configure environment, database clients, hooks, and plugins
  await configureEnv(app)
  await configureClients(app)
  await configureHooks(app)
  await configurePlugins(app)

  // Register routes
  await registerRoutes(app)

  return app
}
