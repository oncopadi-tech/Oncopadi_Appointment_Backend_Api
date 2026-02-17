import Enquiry from 'App/Models/Misc/Enquiry'
import { DateTime } from 'luxon'

export default class MarkAsSeen {
  async handle(ids: Array<number>) {
    const enquiries = await Enquiry.query()
      .whereIn('id', ids)
      .update({ seen_at: DateTime.local().toISO() })

    return enquiries
  }
}
