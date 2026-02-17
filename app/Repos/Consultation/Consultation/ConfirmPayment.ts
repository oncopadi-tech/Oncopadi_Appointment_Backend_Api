import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Consultation from 'App/Models/Consultation/Consultation'
import { getLogStatusCodes } from 'App/Helpers/Index'
import { Exception } from '@poppinss/utils'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreateLog from 'App//Repos/Consultation/Log/Create'
import CreateNotification from 'App/Repos/Misc/Notification/Create'
import Event from '@ioc:Adonis/Core/Event'

export default class ConfirmPayment {
  async handle(id, auth?: AuthContract) {
    var consultation = await Consultation.query()
      .where('id', id)
      .preload('logs', (query) => query.preload('status'))
      .preload('patients')
      .firstOrFail()

    const logStatusCodes = getLogStatusCodes(consultation.logs)

    if (logStatusCodes.includes('paid'))
      throw new Exception('consultation payment already confirmed', 400)

    const status = await ConsultationStatus.findByOrFail('code', 'paid')

    consultation.consultationStatusId = status.id
    await consultation.save()

    await new CreateLog().handle(consultation, 'Consultation paid for', auth)

    if (consultation.patients[0]) {
      await new CreateNotification().handle(
        `Your payment for ${consultation.enquiry} has been confirmed`,
        { user: consultation.patients[0] }
      )
    }

    if (auth?.user)
      Event.emit('consultation/paid', { consultation, user: auth.user })

    return consultation
  }
}
