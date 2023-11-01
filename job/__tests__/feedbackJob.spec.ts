import { FeedbackItem } from '../types'
import FeedbackJob from '../feedbackJob'
import FeedbackRetriever from '../feedbackRetriever'
import SheetsUploader from '../sheetsUploader'
import EmailSender from '../emailSender'

jest.mock('../feedbackRetriever')
jest.mock('../sheetsUploader')
jest.mock('../emailSender')
jest.mock('../config', () => {
  return { notificationSchedule: { day: 0, range: 7 } }
})

describe('feedback retriever', () => {
  let feedbackJob: FeedbackJob
  const feedbackRetriever = new FeedbackRetriever(null) as jest.Mocked<FeedbackRetriever>
  const sheetsUploader = new SheetsUploader(null, null) as jest.Mocked<SheetsUploader>
  const emailSender = new EmailSender(null, null) as jest.Mocked<EmailSender>

  beforeEach(() => {
    jest.resetAllMocks()
    feedbackJob = new FeedbackJob(feedbackRetriever, sheetsUploader, emailSender)
  })

  describe('run', () => {
    it('should pass the correct dates to feedback retriever', async () => {
      await feedbackJob.run(new Date('22 Feb 2021 13:00:00 GMT'))
      expect(feedbackRetriever.retrieve).toHaveBeenCalledWith('2021-02-21', '2021-02-21')
    })

    it('should pass the correct dates to feedback retriever when midnight', async () => {
      await feedbackJob.run(new Date('22 Feb 2021 00:00:00 GMT'))
      expect(feedbackRetriever.retrieve).toHaveBeenCalledWith('2021-02-21', '2021-02-21')
    })

    it('should pass the results of the retriever to the sheets uploader', async () => {
      const feedbackItem = new FeedbackItem('', {})
      feedbackRetriever.retrieve.mockResolvedValue([feedbackItem])
      await feedbackJob.run(new Date('22 Feb 2021 00:00:00 GMT'))
      expect(sheetsUploader.upload).toHaveBeenCalledWith([feedbackItem])
    })

    it('should not send results of the retriever to the email sender', async () => {
      const feedbackItem = new FeedbackItem('', {})
      feedbackRetriever.retrieve.mockResolvedValue([feedbackItem])
      await feedbackJob.run(new Date('22 Feb 2021 00:00:00 GMT'))
      expect(emailSender.send).not.toBeCalled()
    })

    it('should pass the results of the retriever to the email sender', async () => {
      const feedbackItem = new FeedbackItem('', {})
      feedbackRetriever.retrieve.mockResolvedValue([feedbackItem])
      await feedbackJob.run(new Date('21 Feb 2021 00:00:00 GMT'))
      expect(emailSender.send).toHaveBeenCalledWith([feedbackItem])
    })

    it('should pass the correct dates to feedback retriever for email notifications', async () => {
      await feedbackJob.run(new Date('21 Feb 2021 00:00:00 GMT'))
      expect(feedbackRetriever.retrieve).toHaveBeenCalledWith('2021-02-20', '2021-02-20')
      expect(feedbackRetriever.retrieve).toHaveBeenCalledWith('2021-02-13', '2021-02-20')
    })
  })
})
