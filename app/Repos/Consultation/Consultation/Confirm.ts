import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Consultation from 'App/Models/Consultation/Consultation'
import { getLogStatusCodes } from 'App/Helpers/Index'
import { Exception } from '@poppinss/utils'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreateLog from 'App//Repos/Consultation/Log/Create'
import Event from '@ioc:Adonis/Core/Event'
import CreateNotification from 'App/Repos/Misc/Notification/Create'
import logger from '@ioc:Adonis/Core/Logger'

export default class Confirm {
  async handle(id, auth?: AuthContract) {
    var consultation = await Consultation.query()
      .where('id', id)
      .preload('logs', (query) => query.preload('status'))
      .preload('people')
      .preload('status')
      .firstOrFail()

    const logStatusCodes = getLogStatusCodes(consultation.logs)

    if (
      logStatusCodes.includes('confirmed') &&
      consultation.status.code !== 'rescheduled'
    )
      throw new Exception('consultation already confirmed', 400)

    const status = await ConsultationStatus.findByOrFail('code', 'confirmed')

    consultation.consultationStatusId = status.id
    await consultation.save()

    await new CreateLog().handle(consultation, 'Consultation confirmed', auth)

    if (auth?.user)
      Event.emit('consultation/confirmed', { consultation, user: auth.user })

    // send in-app notifications
    for (const user of consultation.people) {
      try {
        await new CreateNotification().handle(
          `Your consultation scheduled for ${consultation.startsAt.toLocaleString()} has been confirmed`,
          { user }
        )
      } catch (error) {
        logger.error(error)
      }
    }

    return consultation
  }
}
