import esb from 'elastic-builder'
import config from './config'
import { FeedbackItem } from './types'
import type HttpClient from './utils/httpClient'

type Hit = { _id: string; _source: Record<string, string> }

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
    const results: Hit[] = response?.hits?.hits || []

    return results.map(({ _id: id, _source: source }) => new FeedbackItem(id, source))
  }
}

export default FeedbackRetriever
