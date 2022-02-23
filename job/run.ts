import { notifyClient } from 'notifications-node-client'
import { google } from 'googleapis'
import logger from './utils/logger'
import applicationVersion from './utils/applicationVersion'

import config from './config'
import FeedbackRetriever from './feedbackRetriever'
import SheetsUploader from './sheetsUploader'
import FeedbackJob from './feedbackJob'
import HttpClient from './utils/httpClient'
import EmailSender from './emailSender'

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
const sheetsUploader = new SheetsUploader(google.sheets('v4'), config.sheetsClient.spreadsheetId)

const emailSender = new EmailSender(notifyClient(config.govNotify.apiKey), [])

const feedbackJob = new FeedbackJob(feedbackRetriever, sheetsUploader, emailSender)

const run = async () => {
  logger.info(`Running application: ${applicationVersion}`)
  await feedbackJob.run()
  logger.info('Upload complete')
}

run().catch(e => {
  process.exitCode = 1
  logger.error('Problem running job', e)
})
