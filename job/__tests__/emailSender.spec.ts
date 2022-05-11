import EmailSender from '../emailSender'
import { FeedbackItem } from '../types'

describe('email sender', () => {
  let emailSender: EmailSender
  const notifyClient = {
    sendEmail: jest.fn(),
    prepareUpload: jest.fn(),
  }

  const contentManagers = [
    { name: 'David', establishment: 'Wayland', email: 'dt@test.com' },
    { name: 'Andy', establishment: 'Wayland', email: 'al@test.com' },
    { name: 'Jon', establishment: 'Cookham Wood', email: 'jh@test.com' },
  ]

  const contentManagerRetriever = jest.fn()

  const feedbackData = [
    new FeedbackItem('dsfaljlfjs-hjjrturu-opareeh', {
      date: '2021-10-05T09:12:37.469Z',
      title: 'Yoga',
      contentType: 'Video',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'Exercise',
      categories: 'Workout',
    }),
    new FeedbackItem('dsfaljlfjs-jhkhkjjh-opareeh', {
      date: '2021-10-05T09:12:37.469Z',
      title: 'Yoga',
      contentType: 'Video',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'Exercise',
      categories: 'Workout',
    }),
    new FeedbackItem('dsfaljlfjs-hjjrturu-eryur5', {
      date: '2021-10-05T09:12:37.469Z',
      title: 'NPR Listen Live',
      contentType: 'audio',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Cookham Wood',
      series: 'NPR',
      categories: 'Music',
    }),
    new FeedbackItem('dsfaljlfjs-hjjrturu-qapvl56', {
      date: '2021-10-05T09:12:37.469Z',
      title: 'PSO/PSI',
      contentType: 'pdf',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'PSO',
      categories: 'Policy',
    }),
  ]

  beforeEach(() => {
    jest.resetAllMocks()
    emailSender = new EmailSender(notifyClient, contentManagerRetriever, () => new Date(2022, 1, 23))
  })

  it('should prepare files', async () => {
    contentManagerRetriever.mockResolvedValue(contentManagers)
    notifyClient.prepareUpload.mockResolvedValueOnce('link-1').mockResolvedValueOnce('link-2')
    notifyClient.sendEmail.mockResolvedValue({})

    await emailSender.send(feedbackData)

    expect(notifyClient.prepareUpload).toHaveBeenCalledTimes(2)
  })

  it('should upload CSVs', async () => {
    contentManagerRetriever.mockResolvedValue([{ name: 'David', establishment: 'Wayland', email: 'dt@test.com' }])
    notifyClient.prepareUpload.mockResolvedValueOnce('link-1')
    notifyClient.sendEmail.mockResolvedValue({})

    await emailSender.send(feedbackData)

    expect(notifyClient.prepareUpload.mock.calls[0][0].toString())
      .toStrictEqual(`Date, Title, Content Type, Sentiment, Comment, Session Id, Establishment, Series, Categories, Feedback Id
"2021-10-05T09:12:37.469Z","Yoga","Video","LIKE","can we have more national radio stations made available.","7dfeca06-2af7-4050-b1e0-c52954703807","Wayland","Exercise","Workout","dsfaljlfjs-hjjrturu-opareeh"
"2021-10-05T09:12:37.469Z","Yoga","Video","LIKE","can we have more national radio stations made available.","7dfeca06-2af7-4050-b1e0-c52954703807","Wayland","Exercise","Workout","dsfaljlfjs-jhkhkjjh-opareeh"
"2021-10-05T09:12:37.469Z","PSO/PSI","pdf","LIKE","can we have more national radio stations made available.","7dfeca06-2af7-4050-b1e0-c52954703807","Wayland","PSO","Policy","dsfaljlfjs-hjjrturu-qapvl56"`)
  })

  it('should send to gov notify', async () => {
    contentManagerRetriever.mockResolvedValue(contentManagers)
    notifyClient.prepareUpload.mockResolvedValueOnce('link-1').mockResolvedValueOnce('link-2')
    notifyClient.sendEmail.mockResolvedValue({})

    await emailSender.send(feedbackData)

    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'dt@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Wayland', name: 'David', link_to_file: 'link-1' },
    })
    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'al@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Wayland', name: 'Andy', link_to_file: 'link-1' },
    })
    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'jh@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Cookham Wood', name: 'Jon', link_to_file: 'link-2' },
    })
  })
})
