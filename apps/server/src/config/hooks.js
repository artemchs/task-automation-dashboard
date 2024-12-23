export async function configureHooks(app) {
  // Execute before every request
  app.addHook('preHandler', async (request) => {
    // Add request timing
    request.startTime = process.hrtime()
  })

  // Execute after every request
  app.addHook('onResponse', async (request) => {
    // Log request duration
    const hrtime = process.hrtime(request.startTime)
    const duration = hrtime[0] * 1000 + hrtime[1] / 1000000
    request.log.info({ duration }, 'request completed')
  })
}
