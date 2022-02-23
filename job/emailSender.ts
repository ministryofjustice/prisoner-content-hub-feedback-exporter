import { format } from 'date-fns'
import { FeedbackItem, Contact } from './types'
import config from './config'
import { logger, groupBy } from './utils'

export default class EmailSender {
  constructor(private readonly notifyApi: any, private readonly contentManagers: Contact[]) {}

  async send(feedback: FeedbackItem[]): Promise<void> {
    const date = format(new Date(), 'yyyy-MM-dd')
    const establishmentToFeedback = groupBy(feedback, f => f.establishment)
    const establishmentToContacts = Array.from(groupBy(this.contentManagers, c => c.establishment))

    const emailRequests = establishmentToContacts.flatMap(async ([establishment, contacts]) => {
      const link = await this.uploadFileContent(establishmentToFeedback.get(establishment) || [])
      const requests = contacts.map(contact => this.sendEmail(contact, date, link))
      return Promise.all(requests)
    })

    await Promise.all(emailRequests)

    logger.info(`Finished sending ${emailRequests.length} emails`)
  }

  private async uploadFileContent(items: FeedbackItem[]) {
    const csv = items.map(f => f.row.join(',')).join('\n')
    const contents = items.length ? csv : 'No feedback for this establishment and timeframe\n'
    return this.notifyApi.prepareUpload(Buffer.from(contents), true)
  }

  private async sendEmail(contact: Contact, date: string, link: string) {
    try {
      await this.notifyApi.sendEmail(config.notify.templateId, contact.email, {
        personalisation: {
          name: contact.name,
          date,
          establishment: contact.establishment,
          link_to_file: link,
        },
      })
      logger.info(`Successfully sent feedback email for ${contact.email}`)
    } catch (err: any) {
      logger.error(err.response.data.errors)
    }
  }
}
