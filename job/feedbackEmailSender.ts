// import logger from './utils/logger'
import { format } from 'date-fns'
import type { FeedbackItem } from './feedbackRetriever'
import config from './config'

type Contact = { name: string; establishment: string; email: string }

const establishmentFeedback = (feedbackItems: FeedbackItem[]) => {
  const establishmentSpecificFeedback = new Map<string, FeedbackItem[]>()

  feedbackItems.forEach(feedbackItem => {
    const establishment = feedbackItem[6]
    if (establishmentSpecificFeedback.has(establishment)) {
      const matchingEstablishment = establishmentSpecificFeedback.get(establishment)
      matchingEstablishment.push(feedbackItem)
      establishmentSpecificFeedback.set(establishment, matchingEstablishment)
    } else establishmentSpecificFeedback.set(establishment, [feedbackItem])
  })
  return establishmentSpecificFeedback
}

const establishmentStaff = (contactList: Contact[]) => {
  const establishmentContactList = new Map<string, Contact[]>()

  contactList.forEach(contact => {
    const { establishment } = contact
    if (establishmentContactList.has(establishment)) {
      const matchingEstablishment = establishmentContactList.get(establishment)
      matchingEstablishment.push(contact)
      establishmentContactList.set(establishment, matchingEstablishment)
    } else establishmentContactList.set(establishment, [contact])
  })
  return establishmentContactList
}
class FeedbackEmailSender {
  constructor(private readonly notifyApi: any, private readonly contentManagers: Contact[]) {}

  async upload(rows: FeedbackItem[]): Promise<void> {
    const date = format(new Date(), 'yyyy-MM-dd')
    const establishmentToFeedback = establishmentFeedback(rows)
    const establishmentToContacts = establishmentStaff(this.contentManagers)
    establishmentToContacts.forEach((contacts, establishment) => {
      const feedback = Buffer.from(
        establishmentToFeedback
          .get(establishment)
          .map(f => f.join(','))
          .join('\n')
      )
      contacts.forEach(contact => {
        this.sendEmail(contact, date, feedback)
      })
    })
    // logger.info(result?.data?.responses || 'No response from sheets API')
  }

  private sendEmail = (contact: Contact, date: string, feedback: any) => {
    this.notifyApi
      .sendEmail(config.govNotify.templateId, contact.email, {
        personalisation: {
          first_name: contact.name,
          date,
          establishment: contact.establishment,
          link_to_file: this.notifyApi.prepareUpload(feedback, true),
        },
      })
      .then((response: any) => console.log(response))
      .catch((err: any) => console.error(err.response.data.errors))
  }
}

export default FeedbackEmailSender
