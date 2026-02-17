import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Consultation from 'App/Models/Consultation/Consultation'
import Event from '@ioc:Adonis/Core/Event'
import { getLogStatusCodes } from 'App/Helpers/Index'
import { Exception } from '@poppinss/utils'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreateLog from 'App//Repos/Consultation/Log/Create'
import User from 'App/Models/People/User'
import CreateNotification from 'App/Repos/Misc/Notification/Create'
import logger from '@ioc:Adonis/Core/Logger'

export default class End {
  async handle(id, auth?: AuthContract | { user: User }) {
    if (!auth?.user) return

    const consultation = await Consultation.query()
      .where('id', id)
      .preload('logs', (query) => query.preload('status'))
      .preload('people')
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    const logStatusCodes = getLogStatusCodes(consultation.logs)

    if (logStatusCodes.includes('completed'))
      throw new Exception('consultation already marked as complete', 400)

    const status = await ConsultationStatus.findByOrFail('code', 'completed')

    consultation.consultationStatusId = status.id
    await consultation.save()

    await new CreateLog().handle(consultation, 'Consultation completed', auth)

    Event.emit('consultation/ended', { consultation, user: auth.user })

    // send in-app notifications
    for (const user of consultation.people) {
      try {
        await new CreateNotification().handle(
          `Your consultation which took place on ${consultation.startsAt.toLocaleString()} has been completed`,
          { user }
        )
      } catch (error) {
        logger.error(error)
      }
    }
  }
}
