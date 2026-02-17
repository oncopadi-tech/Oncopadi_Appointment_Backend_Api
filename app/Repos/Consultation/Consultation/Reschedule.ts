import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import UpdateConsultationValidator from 'App/Validators/Consultation/UpdateConsultationValidator'
import Update from './Update'
import { Exception } from '@poppinss/utils'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreateLog from 'App//Repos/Consultation/Log/Create'
import Event from '@ioc:Adonis/Core/Event'
import CreateNotification from 'App/Repos/Misc/Notification/Create'
import logger from '@ioc:Adonis/Core/Logger'

export default class Reschedule {
  async handle(
    id,
    data: typeof UpdateConsultationValidator.parsedSchema.props,
    auth: AuthContract
  ) {
    const consultation = await new Update().handle(id, data, auth)
    await Promise.all([
      consultation.preload('status'),
      consultation.preload('people')
    ])

    if (consultation.status.code !== 'confirmed')
      throw new Exception('cannot reschedule consultation', 400)

    const status = await ConsultationStatus.findByOrFail('code', 'rescheduled')

    consultation.consultationStatusId = status.id
    await consultation.save()

    await new CreateLog().handle(consultation, 'Consultation rescheduled', auth)

    if (auth?.user)
      Event.emit('consultation/rescheduled', { consultation, user: auth.user })

    // send in-app notifications
    for (const user of consultation.people) {
      try {
        await new CreateNotification().handle(
          `Your consultation has been re-scheduled to ${consultation.startsAt.toLocaleString()}`,
          { user }
        )
      } catch (error) {
        logger.error(error)
      }
    }

    return consultation
  }
}
