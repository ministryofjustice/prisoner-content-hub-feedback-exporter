import { format, subDays } from 'date-fns'
import type FeedbackRetriever from './feedbackRetriever'
import type SheetsUploader from './sheetsUploader'
import type EmailSender from './emailSender'

export default class FeedbackJob {
  constructor(
    private readonly feedbackRetriever: FeedbackRetriever,
    private readonly sheetsUploader: SheetsUploader,
    private readonly emailSender: EmailSender
  ) {}

  async run(today = new Date()): Promise<void> {
    const date = format(subDays(today, 1), 'yyyy-MM-dd')
    const feedback = await this.feedbackRetriever.retrieve(date, date)
    await this.sheetsUploader.upload(feedback)
    await this.emailSender.send(feedback)
  }
}
