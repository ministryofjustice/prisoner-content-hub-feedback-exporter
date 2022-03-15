import ContactsDownloader, { validate } from '../contactsDownloader'

describe('contacts downloader', () => {
  let contactsDownloader: ContactsDownloader
  const sheetsApi = { spreadsheets: { values: { get: jest.fn() } } }

  beforeEach(() => {
    jest.resetAllMocks()
    contactsDownloader = new ContactsDownloader(sheetsApi, 'sheet-1')
  })

  describe('validation', () => {
    test('when no errors present', () => {
      const errors = validate([{ name: 'name-1', establishment: 'wayland', email: 'a@b.c' }])
      expect(errors).toStrictEqual([])
    })

    test('when name is blank', () => {
      const errors = validate([{ name: '', establishment: 'wayland', email: 'a@b.c' }])
      expect(errors).toStrictEqual([`Row 2: Name not provided`])
    })

    test('when establishment is blank', () => {
      const errors = validate([{ name: 'name-1', establishment: '', email: 'a@b.c' }])
      expect(errors).toStrictEqual([`Row 2: Establishment not provided`])
    })

    test('when email format is incorrect', () => {
      const errors = validate([{ name: 'name-1', establishment: 'wayland', email: 'a@b@.c' }])
      expect(errors).toStrictEqual([`Row 2: Email address not valid`])
    })
  })

  describe('download', () => {
    test('Does not error when no data returned', () => {
      sheetsApi.spreadsheets.values.get.mockResolvedValue({})
      contactsDownloader.download()
    })

    test('sheets api called correctly', () => {
      sheetsApi.spreadsheets.values.get.mockResolvedValue({ result: { data: { values: [] } } })
      contactsDownloader.download()

      expect(sheetsApi.spreadsheets.values.get).toHaveBeenCalledWith({
        spreadsheetId: 'sheet-1',
        majorDimension: 'ROWS',
        range: 'Sheet2',
      })
    })

    test('returns transformed contacts', async () => {
      sheetsApi.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['name', 'establishment', 'email'],
            ['bob', 'wayland', 'a@b.c'],
          ],
        },
      })

      const contacts = await contactsDownloader.download()

      expect(contacts).toStrictEqual([
        {
          name: 'bob',
          establishment: 'wayland',
          email: 'a@b.c',
        },
      ])
    })

    test('throws error when invalid contact data', async () => {
      sheetsApi.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['name', 'establishment', 'email'],
            ['bob', 'wayland', ''],
          ],
        },
      })
      await expect(async () => contactsDownloader.download()).rejects.toStrictEqual(
        new Error('Some contacts failed validation')
      )
    })
  })
})
