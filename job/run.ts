import { google } from 'googleapis'
import logger from './utils/logger'
import applicationVersion from './utils/applicationVersion'

import config from './config'
import FeedbackRetriever from './feedbackRetriever'
import FeedbackUploader from './feedbackUploader'
import FeedbackJob from './feedbackJob'
import HttpClient from './utils/httpClient'

const feedbackRetriever = new FeedbackRetriever(new HttpClient())

const getCredentials = () => {
  try {
    return JSON.parse(config.sheetsClient.serviceAccountKey)
  } catch (e) {
    // Deliberately obfuscate actual error as may contain creds/key
    throw new Error('An error occurred parsing creds')
  }
}

const auth = new google.auth.GoogleAuth({
  credentials: getCredentials(),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
google.options({ auth })
const feedbackUploader = new FeedbackUploader(google.sheets('v4'), config.sheetsClient.spreadsheetId)

const feedbackJob = new FeedbackJob(feedbackRetriever, feedbackUploader)

const run = async () => {
  logger.info(`Running application: ${applicationVersion}`)
  await feedbackJob.run()
  logger.info('Upload complete')
}

run().catch(e => {
  process.exitCode = 1
  logger.error('Problem running job', e)
})
