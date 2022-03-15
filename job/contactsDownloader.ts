import { Contact } from './types'
import logger from './utils/logger'

export const validate = (contacts: Contact[]): string[] => {
  const errors: string[] = contacts.flatMap((contact, i) => [
    ...(contact.name ? [] : [`Row ${i + 2}: Name not provided`]),
    ...(contact.establishment ? [] : [`Row ${i + 2}: Establishment not provided`]),
    ...(contact.email ? [] : [`Row ${i + 2}: Email address not provided`]),
    ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? [] : [`Row ${i + 2}: Email address not valid`]),
  ])
  return errors
}

export default class ContactsDownloader {
  constructor(private readonly sheetsApi: any, private readonly spreadsheetId: string) {}

  async download(): Promise<Contact[]> {
    const result = await this.sheetsApi.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      majorDimension: 'ROWS',
      range: 'Sheet2',
    })
    const [, ...rows] = result?.data?.values || []
    const contacts: Contact[] = rows.map(([name, establishment, email]: string[]) => ({ name, establishment, email }))
    const errors = validate(contacts)
    if (errors.length) {
      logger.error(errors.join('\n'))
      throw new Error('Some contacts failed validation')
    }
    return contacts
  }
}
