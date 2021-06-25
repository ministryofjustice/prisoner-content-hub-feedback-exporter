import { format, subDays } from 'date-fns'
import type FeedbackRetriever from './feedbackRetriever'
import type FeedbackUploader from './feedbackUploader'

class FeedbackJob {
  constructor(
    private readonly feedbackRetriever: FeedbackRetriever,
    private readonly feedbackUploader: FeedbackUploader
  ) {}

  async run(today = new Date()): Promise<void> {
    const startDate = format(subDays(today, 1), 'yyyy-MM-dd')
    const endDate = format(subDays(today, 1), 'yyyy-MM-dd')
    const feedback = await this.feedbackRetriever.retrieve(startDate, endDate)
    await this.feedbackUploader.upload(feedback)
  }
}

export default FeedbackJob
