import { format, subDays } from 'date-fns'
import type FeedbackRetriever from './feedbackRetriever'
import type FeedbackUploader from './feedbackUploader'
import type FeedbackEmailSender from './feedbackEmailSender'

class FeedbackJob {
  constructor(
    private readonly feedbackRetriever: FeedbackRetriever,
    private readonly feedbackUploader: FeedbackUploader,
    private readonly feedbackEmailSender: FeedbackEmailSender
  ) {}

  async run(today = new Date()): Promise<void> {
    const date = format(subDays(today, 1), 'yyyy-MM-dd')
    const feedback = await this.feedbackRetriever.retrieve(date, date)
    await this.feedbackUploader.upload(feedback)
    await this.feedbackEmailSender.upload(feedback)
  }
}

export default FeedbackJob
