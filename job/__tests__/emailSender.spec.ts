import EmailSender from '../emailSender'
import { FeedbackItem } from '../types'

describe('feedback sender', () => {
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

  const feedbackData = [
    new FeedbackItem({
      date: '2021-10-05T09:12:37.469Z',
      title: 'Yoga',
      contentType: 'Video',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'Exercise',
    }),
    new FeedbackItem({
      date: '2021-10-05T09:12:37.469Z',
      title: 'Yoga',
      contentType: 'Video',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'Exercise',
    }),
    new FeedbackItem({
      date: '2021-10-05T09:12:37.469Z',
      title: 'NPR Listen Live',
      contentType: 'audio',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Cookham Wood',
      series: 'NPR',
    }),
    new FeedbackItem({
      date: '2021-10-05T09:12:37.469Z',
      title: 'PSO/PSI',
      contentType: 'pdf',
      sentiment: 'LIKE',
      comment: 'can we have more national radio stations made available.',
      sessionId: '7dfeca06-2af7-4050-b1e0-c52954703807',
      establishment: 'Wayland',
      series: 'PSO',
    }),
  ]

  beforeEach(() => {
    jest.resetAllMocks()
    emailSender = new EmailSender(notifyClient, contentManagers)
  })

  it('should prepare files', async () => {
    notifyClient.prepareUpload.mockResolvedValueOnce('link-1').mockResolvedValueOnce('link-2')
    notifyClient.sendEmail.mockResolvedValue({})

    await emailSender.send(feedbackData)

    expect(notifyClient.prepareUpload).toHaveBeenCalledTimes(2)
  })

  it('should send to gov notify', async () => {
    notifyClient.prepareUpload.mockResolvedValueOnce('link-1').mockResolvedValueOnce('link-2')
    notifyClient.sendEmail.mockResolvedValue({})

    await emailSender.send(feedbackData)

    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'dt@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Wayland', first_name: 'David', link_to_file: 'link-1' },
    })
    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'al@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Wayland', first_name: 'Andy', link_to_file: 'link-1' },
    })
    expect(notifyClient.sendEmail).toHaveBeenCalledWith('6a865bb8-5452-4314-9e54-b4d844d6e747', 'jh@test.com', {
      personalisation: { date: '2022-02-23', establishment: 'Cookham Wood', first_name: 'Jon', link_to_file: 'link-2' },
    })
  })
})
