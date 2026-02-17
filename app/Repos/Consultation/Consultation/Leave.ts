import ConsultationAttendance from 'App/Models/Consultation/ConsultationAttendance'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { DateTime } from 'luxon'
import CreateActivity from 'App/Repos/Misc/Activity/Create'

export default class Leave {
  async handle(id, auth: AuthContract) {
    var attendance = await ConsultationAttendance.query()
      .where({
        userId: auth.user?.id,
        consultationId: id
      })
      .preload('consultation')
      .firstOrFail()

    attendance.leftAt = DateTime.fromMillis(Date.now())
    await attendance.save()

    await new CreateActivity().handle(
      `You left ${attendance.consultation.enquiry || 'a recent consultation'}`,
      auth
    )

    return attendance.consultation
  }
}
