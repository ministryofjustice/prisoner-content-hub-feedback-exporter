import axios from 'axios'
import logger from './logger'

class HttpClient {
  constructor(private readonly client = axios) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post(endpoint: string, data: unknown): any {
    return this.client.post(endpoint, data).then(res => {
      logger.info(`HttpClient (POST) ${endpoint}`)
      return res.data
    })
  }
}

export default HttpClient
