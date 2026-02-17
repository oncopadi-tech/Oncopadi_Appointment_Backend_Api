import UpdateConsultationValidator from 'App/Validators/Consultation/UpdateConsultationValidator'
import Consultation from 'App/Models/Consultation/Consultation'
import CreateOrUpdateReferral from 'App/Repos/Consultation/Referral/CreateOrUpdate'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Doctor from 'App/Models/People/Doctor'

export default class Update {
  async handle(
    id,
    data: typeof UpdateConsultationValidator.parsedSchema.props,
    auth: AuthContract
  ) {
    var consultation = await Consultation.query()
      .where('id', id)
      .preload('people')
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    for (const key in data) {
      if (
        [
          'enquiry',
          'startsAt',
          'price',
          'currency',
          'notes',
          'prescription',
          'summary'
        ].includes(key)
      )
        consultation[key] =
          typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    const { attendees, doctorId, referral } = data

    if (attendees) await consultation.related('people').sync(attendees)

    // update doctor & remove old doctor from attendees
    if (doctorId && consultation.doctorId !== doctorId) {
      const doctor = await Doctor.findOrFail(doctorId)

      const peopleIds = consultation.people.map((person) => person.id)

      if (!peopleIds.includes(doctor.userId))
        await consultation.related('people').attach([doctor.userId])

      if (consultation.doctorId) {
        const oldDoctor = await Doctor.findOrFail(consultation.doctorId)
        if (peopleIds.includes(oldDoctor.userId))
          await consultation.related('people').detach([oldDoctor.userId])
      }

      consultation.doctorId = doctorId
    }

    if (referral) {
      await new CreateOrUpdateReferral().handle({
        consultationId: consultation.id,
        doctorId: consultation.doctorId,
        ...referral
      })
    }

    await consultation.save()

    return consultation
  }
}
