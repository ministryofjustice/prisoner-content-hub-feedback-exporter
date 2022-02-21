import esb from 'elastic-builder'
import config from './config'
import type HttpClient from './utils/httpClient'

export type FeedbackItem = [
  date: string,
  title: string,
  contentType: string,
  sentiment: string,
  comment: string,
  sessionId: string,
  establishment: string,
  series: string
]
const columnNames = ['date', 'title', 'contentType', 'sentiment', 'comment', 'sessionId', 'establishment', 'series']

function toLine(result: any): FeedbackItem {
  // eslint-disable-next-line no-underscore-dangle
  return columnNames.map(columnName => result._source[columnName]) as unknown as FeedbackItem
}

class FeedbackRetriever {
  constructor(private readonly httpClient: HttpClient) {}

  async retrieve(startDate: string, endDate: string): Promise<FeedbackItem[]> {
    const esbRequest = esb
      .requestBodySearch()
      .query(esb.boolQuery().filter([esb.rangeQuery('date').gte(startDate).lte(endDate)]))
      .size(10000)
      .sort(esb.sort('date', 'desc'))
      .toJSON()
    const response = await this.httpClient.post(config.elasticsearch.feedback, esbRequest)
    const results = response?.hits?.hits || []

    return results.map(toLine)
  }
}

export default FeedbackRetriever
