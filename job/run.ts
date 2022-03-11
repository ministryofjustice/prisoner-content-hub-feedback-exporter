import { NotifyClient } from 'notifications-node-client'
import { google } from 'googleapis'
import logger from './utils/logger'
import applicationVersion from './utils/applicationVersion'

import config from './config'
import FeedbackRetriever from './feedbackRetriever'
import SheetsUploader from './sheetsUploader'
import FeedbackJob from './feedbackJob'
import HttpClient from './utils/httpClient'
import EmailSender from './emailSender'
import ContactsDownloader from './contactsDownloader'

const feedbackRetriever = new FeedbackRetriever(new HttpClient())

const auth = new google.auth.GoogleAuth({
  credentials: config.sheetsClient.serviceAccountKey,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})
google.options({ auth })
const sheetsUploader = new SheetsUploader(google.sheets('v4'), config.sheetsClient.spreadsheetId)

const contactsDownloader = new ContactsDownloader(google.sheets('v4'), config.sheetsClient.spreadsheetId)

const emailSender = new EmailSender(new NotifyClient(config.notify.apiKey), () => contactsDownloader.download())

const feedbackJob = new FeedbackJob(feedbackRetriever, sheetsUploader, emailSender)

const run = async () => {
  logger.info(`Running application: ${applicationVersion}`)
  await feedbackJob.run()
  logger.info('Job complete')
}

run().catch(e => {
  process.exitCode = 1
  logger.error('Problem running job', e)
})
