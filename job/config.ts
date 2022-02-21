import 'dotenv/config'

const {
  ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint = 'http://localhost:9200',
  SERVICE_ACCOUNT_KEY: serviceAccountKey,
  SPREADSHEET_ID: spreadsheetId,
  GOV_NOTIFY_API_KEY: apiKey,
  GOV_NOTIFY_TEMPLATE_ID: templateId,
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
    apiKey,
    templateId,
  },
}
