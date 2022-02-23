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
  public readonly row: string[]

  constructor(row: Record<string, string>) {
    this.date = row.date
    this.title = row.title
    this.contentType = row.contentType
    this.sentiment = row.sentiment
    this.comment = row.comment
    this.sessionId = row.sessionId
    this.establishment = row.establishment
    this.series = row.series
    this.row = [
      this.date,
      this.title,
      this.contentType,
      this.sentiment,
      this.comment,
      this.sessionId,
      this.establishment,
      this.series,
    ]
  }
}

export type Contact = { name: string; establishment: string; email: string }
