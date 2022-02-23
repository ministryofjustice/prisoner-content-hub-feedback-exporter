import { FeedbackItem } from './types'
import logger from './utils/logger'

export default class SheetsUploader {
  constructor(private readonly sheetsApi: any, private readonly spreadsheetId: string) {}

  async upload(rows: FeedbackItem[]): Promise<void> {
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
            values: rows.map(r => r.row),
          },
        ],
        valueInputOption: 'RAW',
      },
    })
    logger.info(result?.data?.responses || 'No response from sheets API')
  }
}
