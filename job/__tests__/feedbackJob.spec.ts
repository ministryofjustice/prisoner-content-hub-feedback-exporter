import FeedbackJob from '../feedbackJob'
import FeedbackRetriever, { FeedbackItem } from '../feedbackRetriever'
import FeedbackUploader from '../feedbackUploader'

jest.mock('../feedbackRetriever')
jest.mock('../feedbackUploader')
describe('feedback retriever', () => {
  let feedbackJob: FeedbackJob
  const feedbackRetriever = new FeedbackRetriever(null) as jest.Mocked<FeedbackRetriever>
  const feedbackUploader = new FeedbackUploader(null, null) as jest.Mocked<FeedbackUploader>

  beforeEach(() => {
    jest.resetAllMocks()
    feedbackJob = new FeedbackJob(feedbackRetriever, feedbackUploader, null)
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

    it('should pass the results of the retriever to the upload', async () => {
      feedbackRetriever.retrieve.mockResolvedValue([['cell1'] as unknown as FeedbackItem])
      await feedbackJob.run(new Date('22 Feb 2021 00:00:00 GMT'))
      expect(feedbackUploader.upload).toHaveBeenCalledWith([['cell1']])
    })
  })
})
