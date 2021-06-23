import logger from './logger'
import applicationVersion from './applicationVersion'

const run = async () => {
  logger.info(`Running application: ${applicationVersion}`)
}

run().catch(e => logger.error('Problem running job', e))
