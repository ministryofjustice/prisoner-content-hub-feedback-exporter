import 'dotenv/config'

const {
  ELASTICSEARCH_ENDPOINT: elasticsearchEndpoint = 'http://localhost:9200',
  SERVICE_ACCOUNT_KEY: serviceAccountKey,
  SPREADSHEET_ID: spreadsheetId,
  GOV_NOTIFY_API_KEY: apiKey,
  NOTIFICATION_DAY: notificationDay,
  NOTIFICATION_RANGE: notificationRange,
} = process.env

const parse = (type: string, value: string) => {
  try {
    return JSON.parse(value)
  } catch (e) {
    // Deliberately obfuscate actual error as may contain creds/key
    throw new Error(`An error occurred parsing ${type}`)
  }
}

export = {
  elasticsearch: {
    feedback: `${elasticsearchEndpoint}/prod-feedback/_search`,
  },
  sheetsClient: {
    serviceAccountKey: parse('creds', serviceAccountKey || '{}'),
    spreadsheetId,
  },
  notify: {
    apiKey: apiKey || 'some-test-key',
    templateId: '6a865bb8-5452-4314-9e54-b4d844d6e747',
  },
  notificationSchedule: {
    day: parseInt(notificationDay, 10) || 4,
    range: parseInt(notificationRange, 10) || 7,
  },
}
