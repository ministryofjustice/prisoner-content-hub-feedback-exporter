import logger from './utils/logger'

class FeedbackUploader {
  constructor(private readonly sheetsApi: any, private readonly spreadsheetId: string) {}

  async upload(rows: string[][]): Promise<void> {
    const appendResult = await this.sheetsApi.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      insertDataOption: 'INSERT_ROWS',
      valueInputOption: 'USER_ENTERED',
      range: 'A1',
      table: {
        values: [],
      },
    })
    const nextCell = appendResult.data.updates.updatedRange

    const result = await this.sheetsApi.spreadsheets.values.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      resource: {
        data: [
          {
            range: nextCell,
            values: rows,
          },
        ],
        valueInputOption: 'RAW',
      },
    })
    logger.info(result?.data?.responses || 'No response from sheets API')
  }
}
export default FeedbackUploader
