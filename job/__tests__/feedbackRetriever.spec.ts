import FeedbackRetriever from '../feedbackRetriever'
import StandardClient from '../utils/httpClient'

jest.mock('../utils/httpClient')

describe('feedback retriever', () => {
  let feedbackRetriever: FeedbackRetriever
  const httpClient = new StandardClient(null) as jest.Mocked<StandardClient>

  beforeEach(() => {
    feedbackRetriever = new FeedbackRetriever(httpClient)
  })

  describe('get feedback', () => {
    it('should perform a query', async () => {
      await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(httpClient.post).toHaveBeenCalledWith('http://localhost:9200/prod-feedback/_search', {
        query: {
          bool: {
            filter: {
              range: { date: { gte: '2021-06-03', lte: '2021-06-06' } },
            },
          },
        },
        size: 10000,
        sort: [{ date: 'desc' }],
      })
    })

    it('should handle nil result response', async () => {
      httpClient.post.mockResolvedValue({ hits: { hits: [] } })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([])
    })

    it('should handle no response', async () => {
      httpClient.post.mockResolvedValue(undefined)
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([])
    })

    it('should map results to CSV format', async () => {
      httpClient.post.mockResolvedValue({
        hits: {
          hits: [
            {
              _source: {
                date: '2021-06-03',
                title: 'Park run',
                contentType: 'Article',
                sentiment: 'Like',
                comment: 'Love it',
                sessionId: 'kj453eeeafjlkj5wf44n',
                establishment: 'Wayland',
                series: 'Exercise',
              },
            },
          ],
        },
      })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([
        ['2021-06-03', 'Park run', 'Article', 'Like', 'Love it', 'kj453eeeafjlkj5wf44n', 'Wayland', 'Exercise'],
      ])
    })

    it('should ignore additional fields', async () => {
      httpClient.post.mockResolvedValue({
        hits: {
          hits: [
            {
              _source: {
                Field1: 'fsjhf',
                date: '2021-06-03',
                title: 'Park run',
                contentType: 'Article',
                sentiment: 'Like',
                Field2: 'fsjhf',
                comment: 'Love it',
                sessionId: 'kj453eeeafjlkj5wf44n',
                establishment: 'Wayland',
                series: 'Exercise',
                Field3: 'fsjhf',
              },
            },
          ],
        },
      })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([
        ['2021-06-03', 'Park run', 'Article', 'Like', 'Love it', 'kj453eeeafjlkj5wf44n', 'Wayland', 'Exercise'],
      ])
    })

    it('should ignore missing fields', async () => {
      httpClient.post.mockResolvedValue({
        hits: {
          hits: [
            {
              _source: {
                title: 'Park run',
                contentType: 'Article',
                comment: 'Love it',
                sessionId: 'kj453eeeafjlkj5wf44n',
                establishment: 'Wayland',
              },
            },
          ],
        },
      })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([
        [undefined, 'Park run', 'Article', undefined, 'Love it', 'kj453eeeafjlkj5wf44n', 'Wayland', undefined],
      ])
    })
  })
})
