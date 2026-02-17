import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Consultation from 'App/Models/Consultation/Consultation'
import { getLogStatusCodes } from 'App/Helpers/Index'
import { Exception } from '@poppinss/utils'
import ConsultationStatus from 'App/Models/Consultation/ConsultationStatus'
import CreateLog from 'App//Repos/Consultation/Log/Create'

export default class Cancel {
  async handle(id, auth: AuthContract) {
    var consultation = await Consultation.query()
      .where('id', id)
      .apply((scopes) => scopes.byUser(auth.user))
      .preload('logs', (query) => query.preload('status'))
      .firstOrFail()

    const logStatusCodes = getLogStatusCodes(consultation.logs)

    if (
      ['cancelled', 'confirmed'].find((code) => logStatusCodes.includes(code))
    )
      throw new Exception('cannot cancel consultation', 400)

    const status = await ConsultationStatus.findByOrFail('code', 'cancelled')

    consultation.consultationStatusId = status.id
    await consultation.save()

    await new CreateLog().handle(consultation, 'Consultation cancelled', auth)

    return consultation
  }
}
