import FeedbackUploader from '../feedbackUploader'

describe('feedback retriever', () => {
  let feedbackUploader: FeedbackUploader
  const sheetsApi = { spreadsheets: { values: { append: jest.fn(), batchUpdate: jest.fn() } } }

  beforeEach(() => {
    jest.resetAllMocks()
    feedbackUploader = new FeedbackUploader(sheetsApi, 'spreadsheet1')
  })

  describe('upload feedback', () => {
    it('should call the append function', async () => {
      sheetsApi.spreadsheets.values.append.mockResolvedValue({ data: { updates: { updatedRange: 'sheet1!A1' } } })
      await feedbackUploader.upload([['cell1']])
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
      await feedbackUploader.upload([['cell1']])
      expect(sheetsApi.spreadsheets.values.batchUpdate).toHaveBeenCalledWith({
        resource: {
          data: [
            {
              range: 'sheet1!A1',
              values: [['cell1']],
            },
          ],
          valueInputOption: 'RAW',
        },
        spreadsheetId: 'spreadsheet1',
      })
    })
  })
})
