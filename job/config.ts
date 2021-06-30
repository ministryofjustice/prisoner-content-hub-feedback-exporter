import 'dotenv/config'

const {
  ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint = 'http://localhost:9200',
  SERVICE_ACCOUNT_KEY: serviceAccountKey,
  SPREADSHEET_ID: spreadsheetId,
} = process.env

export = {
  elasticsearch: {
    feedback: `${elasticsearchEndpoint}/prod-feedback/_search`,
  },
  sheetsClient: {
    serviceAccountKey,
    spreadsheetId,
  },
}
