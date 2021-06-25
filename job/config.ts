import 'dotenv/config'

const elasticsearchEndpoint = process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200'

export = {
  elasticsearch: {
    feedback: `${elasticsearchEndpoint}/prod-feedback/_search`,
  },
  sheetsClient: {
    serviceAccountKey: process.env.SERVICE_ACCOUNT_KEY,
    spreadsheetId: process.env.SPREADSHEET_ID,
  },
}
