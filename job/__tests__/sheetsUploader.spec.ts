import { FeedbackItem } from '../types'
import SheetsUploader from '../sheetsUploader'

const FEEDBACK_ITEM = new FeedbackItem({
  Field1: 'fsjhf',
  date: '2021-06-03',
  title: 'Park run',
  contentType: 'Article',
  sentiment: 'Like',
  Field2: 'fsjhf',
  comment: 'Love it',
  sessionId: 'kj453eeeafjlkj5wf44n',
  establishment: 'Wayland',
  series: 'Exercise',
  Field3: 'fsjhf',
})

describe('sheets uploader', () => {
  let sheetsUploader: SheetsUploader
  const sheetsApi = { spreadsheets: { values: { append: jest.fn(), batchUpdate: jest.fn() } } }

  beforeEach(() => {
    jest.resetAllMocks()
    sheetsUploader = new SheetsUploader(sheetsApi, 'spreadsheet1')
  })

  describe('upload feedback', () => {
    it('should call the append function', async () => {
      sheetsApi.spreadsheets.values.append.mockResolvedValue({ data: { updates: { updatedRange: 'sheet1!A1' } } })
      await sheetsUploader.upload([FEEDBACK_ITEM])
      expect(sheetsApi.spreadsheets.values.append).toHaveBeenCalledWith({
        insertDataOption: 'INSERT_ROWS',
        range: 'A1',
        spreadsheetId: 'spreadsheet1',
        table: { values: [] },
        valueInputOption: 'USER_ENTERED',
      })
    })

    it('should call the batch update function', async () => {
      sheetsApi.spreadsheets.values.append.mockResolvedValue({ data: { updates: { updatedRange: 'sheet1!A1' } } })
      await sheetsUploader.upload([FEEDBACK_ITEM])
      expect(sheetsApi.spreadsheets.values.batchUpdate).toHaveBeenCalledWith({
        resource: {
          data: [
            {
              range: 'sheet1!A1',
              values: [FEEDBACK_ITEM.row],
            },
          ],
          valueInputOption: 'RAW',
        },
        spreadsheetId: 'spreadsheet1',
      })
    })
  })
})
