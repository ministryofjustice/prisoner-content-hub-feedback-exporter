/* eslint-disable lines-between-class-members */
export class FeedbackItem {
  public readonly date: string
  public readonly title: string
  public readonly contentType: string
  public readonly sentiment: string
  public readonly comment: string
  public readonly sessionId: string
  public readonly establishment: string
  public readonly series: string
  public readonly feedbackId: string
  public readonly categories: string
  public readonly row: string[]

  public static getFeedbackHeader() {
    return [
      'Date',
      'Title',
      'Content Type',
      'Sentiment',
      'Comment',
      'Session Id',
      'Establishment',
      'Series',
      'Categories',
      'Feedback Id',
    ]
  }

  constructor(feedbackId: string, row: Record<string, string>) {
    this.date = row.date
    this.title = row.title
    this.contentType = row.contentType
    this.sentiment = row.sentiment
    this.comment = row.comment
    this.sessionId = row.sessionId
    this.establishment = row.establishment
    this.series = row.series
    this.categories = row.categories
    this.feedbackId = feedbackId
    this.row = [
      this.date,
      this.title,
      this.contentType,
      this.sentiment,
      this.comment,
      this.sessionId,
      this.establishment,
      this.series,
      this.categories,
      this.feedbackId,
    ]
  }

  formattedRow() {
    return this.row
      .map(cell => `"${cell || ''}"`)
      .join(',')
      .replace(/\n/g, '')
  }
}

export type Contact = { name: string; establishment: string; email: string }
