import { format, subDays } from 'date-fns'
import type FeedbackRetriever from './feedbackRetriever'
import type SheetsUploader from './sheetsUploader'
import type EmailSender from './emailSender'
import config from './config'

export default class FeedbackJob {
  constructor(
    private readonly feedbackRetriever: FeedbackRetriever,
    private readonly sheetsUploader: SheetsUploader,
    private readonly emailSender: EmailSender,
  ) {}

  async run(today = new Date()): Promise<void> {
    const yesterday = format(subDays(today, 1), 'yyyy-MM-dd')
    const feedback = await this.feedbackRetriever.retrieve(yesterday, yesterday)
    const {
      notificationSchedule: { day, range },
    } = config
    await this.sheetsUploader.upload(feedback)
    if (today.getDay() === day) {
      const lastWeek = format(subDays(today, range + 1), 'yyyy-MM-dd')
      const emailFeedback = await this.feedbackRetriever.retrieve(lastWeek, yesterday)
      await this.emailSender.send(emailFeedback)
    }
  }
}
