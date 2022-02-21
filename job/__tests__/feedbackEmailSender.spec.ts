import FeedbackEmailSender from '../feedbackEmailSender'

describe('feedback sender', () => {
  let feedbackEmailSender: FeedbackEmailSender
  const notifyClient = {
    sendEmail = jest.fn(),
    prepareUpload = jest.fn(),
  }

  const contentManagers = [
    { name: 'David', establishment: 'Wayland', email: 'dt@test.com' },
    { name: 'Andy', establishment: 'Wayland', email: 'al@test.com' },
    { name: 'Jon', establishment: 'Cookham Wood', email: 'jh@test.com' },
  ]

  const feedbackData = [
    [
      '2021-10-05T09:12:37.469Z',
      'Yoga',
      'Video',
      'LIKE',
      'can we have more national radio stations made available.',
      '7dfeca06-2af7-4050-b1e0-c52954703807',
      'Wayland',
      'Exercise',
    ],
    [
      '2021-10-05T09:12:37.469Z',
      'Yoga',
      'Video',
      'LIKE',
      'can we have more national radio stations made available.',
      '7dfeca06-2af7-4050-b1e0-c52954703807',
      'Wayland',
      'Exercise',
    ],
    [
      '2021-10-05T09:12:37.469Z',
      'NPR Listen Live',
      'audio',
      'LIKE',
      'can we have more national radio stations made available.',
      '7dfeca06-2af7-4050-b1e0-c52954703807',
      'Cookham Wood',
      'NPR',
    ],
    [
      '2021-10-05T09:12:37.469Z',
      'PSO/PSI',
      'pdf',
      'LIKE',
      'can we have more national radio stations made available.',
      '7dfeca06-2af7-4050-b1e0-c52954703807',
      'Wayland',
      'PSO',
    ],
  ]

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should send to gov notify', async () => {
    const fbs = new FeedbackEmailSender(notifyClient, contentManagers)
    const results = fbs.upload(feedbackData)
  })
})
