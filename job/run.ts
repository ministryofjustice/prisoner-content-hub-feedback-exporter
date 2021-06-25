import { google } from 'googleapis'
import logger from './utils/logger'
import applicationVersion from './utils/applicationVersion'

import config from './config'
import FeedbackRetriever from './feedbackRetriever'
import FeedbackUploader from './feedbackUploader'
import FeedbackJob from './feedbackJob'
import HttpClient from './utils/httpClient'

const feedbackRetriever = new FeedbackRetriever(new HttpClient())

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(config.sheetsClient.serviceAccountKey),
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

run().catch(e => logger.error('Problem running job', e))
