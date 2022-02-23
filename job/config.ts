import 'dotenv/config'

const {
  ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint = 'http://localhost:9200',
  SERVICE_ACCOUNT_KEY: serviceAccountKey,
  SPREADSHEET_ID: spreadsheetId,
  GOV_NOTIFY_API_KEY: apiKey,
} = process.env

export = {
  elasticsearch: {
    feedback: `${elasticsearchEndpoint}/prod-feedback/_search`,
  },
  sheetsClient: {
    serviceAccountKey,
    spreadsheetId,
  },
  govNotify: {
    apiKey: apiKey || 'some-test-key',
    templateId: '6a865bb8-5452-4314-9e54-b4d844d6e747',
  },
}
