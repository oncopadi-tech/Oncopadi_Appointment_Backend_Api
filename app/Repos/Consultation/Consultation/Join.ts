import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { DateTime } from 'luxon'
import Event from '@ioc:Adonis/Core/Event'
import Consultation from 'App/Models/Consultation/Consultation'
import CreateActivity from 'App/Repos/Misc/Activity/Create'

export default class Join {
  async handle(
    id,
    { relationships = [] }: { relationships?: Array<any> },
    auth: AuthContract
  ) {
    var query = Consultation.query().where('id', id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const consultation = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .preload('present')
      .firstOrFail()

    await consultation.related('attendance').updateOrCreate(
      {
        userId: auth.user?.id,
        consultationId: consultation.id
      },
      {
        joinedAt: DateTime.fromMillis(Date.now()),
        leftAt: undefined
      }
    )

    await new CreateActivity().handle(
      `You joined ${consultation.enquiry}`,
      auth
    )

    if (consultation.present.length < 1 && auth.user) {
      Event.emit('consultation/started', {
        consultation,
        user: auth.user
      })
    } else if (auth.user) {
      Event.emit('consultation/joined', {
        consultation,
        user: auth.user
      })
    }

    return consultation
  }
}
