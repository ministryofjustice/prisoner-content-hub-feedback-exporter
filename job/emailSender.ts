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

    const emailRequests = establishmentToContacts.map(async ([establishment, contacts]) => {
      const link = await this.uploadFileContent(establishmentToFeedback.get(establishment))
      contacts.forEach(contact => {
        this.sendEmail(contact, date, link)
      })
    })

    await Promise.all(emailRequests)

    logger.info(`Finished sending ${emailRequests.length} emails`)
  }

  private uploadFileContent = async (items: FeedbackItem[]) => {
    const contents = items.map(f => f.row.join(',')).join('\n')
    return this.notifyApi.prepareUpload(Buffer.from(contents), true)
  }

  private sendEmail = async (contact: Contact, date: string, link: string) => {
    this.notifyApi
      .sendEmail(config.govNotify.templateId, contact.email, {
        personalisation: {
          first_name: contact.name,
          date,
          establishment: contact.establishment,
          link_to_file: link,
        },
      })
      .then(() => logger.info(`Successfully sent feedback email for ${contact.email}`))
      .catch((err: any) => logger.error(err.response.data.errors))
  }
}
