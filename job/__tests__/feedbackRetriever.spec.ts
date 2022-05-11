import { FeedbackItem } from '../types'
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
              _id: '2b1e137e-fe2d-4972-a864-afkjlflgj567',
              _source: {
                date: '2021-06-03',
                title: 'Park run',
                contentType: 'Article',
                sentiment: 'Like',
                comment: 'Love it',
                sessionId: 'kj453eeeafjlkj5wf44n',
                establishment: 'Wayland',
                series: 'Exercise',
                categories: 'Workout',
              },
            },
          ],
        },
      })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([
        new FeedbackItem('2b1e137e-fe2d-4972-a864-afkjlflgj567', {
          date: '2021-06-03',
          title: 'Park run',
          contentType: 'Article',
          sentiment: 'Like',
          comment: 'Love it',
          sessionId: 'kj453eeeafjlkj5wf44n',
          establishment: 'Wayland',
          series: 'Exercise',
          categories: 'Workout',
        }),
      ])
    })

    it('should ignore additional fields', async () => {
      httpClient.post.mockResolvedValue({
        hits: {
          hits: [
            {
              _id: '2b1e137e-fe2d-4972-a864-kh231hhkkh667',
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
                categories: 'Workout',
                Field3: 'fsjhf',
              },
            },
          ],
        },
      })
      const response = await feedbackRetriever.retrieve('2021-06-03', '2021-06-06')

      expect(response).toStrictEqual([
        new FeedbackItem('2b1e137e-fe2d-4972-a864-kh231hhkkh667', {
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
          categories: 'Workout',
          Field3: 'fsjhf',
        }),
      ])
    })

    it('should ignore missing fields', async () => {
      httpClient.post.mockResolvedValue({
        hits: {
          hits: [
            {
              _id: '2b1e137e-fe2d-4972-a864-18dgdgh456',
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
        new FeedbackItem('2b1e137e-fe2d-4972-a864-18dgdgh456', {
          title: 'Park run',
          contentType: 'Article',
          comment: 'Love it',
          sessionId: 'kj453eeeafjlkj5wf44n',
          establishment: 'Wayland',
        }),
      ])
    })
  })
})
