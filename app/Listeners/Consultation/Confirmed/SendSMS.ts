import { EventsList } from '@ioc:Adonis/Core/Event'
import { getRoleCodes } from 'App/Helpers/Index'
import AfricasTalking from 'App/Services/AfricasTalking/AfricasTalking'
import { textHelpMesssage } from 'Config/oncopadi'

export default class SendSMS {
  async handle({ consultation }: EventsList['consultation/paid']) {
    await Promise.all([
      consultation.preload('people', (query) => query.preload('roles')),
      consultation.preload('doctor', (query) => query.preload('user'))
    ])

    const doctor = `${consultation.doctor.title} ${consultation.doctor.user.name}`
    const patient = consultation.people.filter((user) =>
      getRoleCodes(user).includes('patient')
    )[0]?.name

    const date = consultation.startsAt.toLocaleString()
    const time = consultation.startsAt.toLocaleString({
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    for (const user of consultation.people) {
      if (!user.phone) continue
      const roleCodes = getRoleCodes(user)
      const participant = roleCodes.includes('patient') ? doctor : patient

      await new AfricasTalking().sendSMS(
        `Hi, your video consultation with ${participant} on ${date} at ${time} has been confirmed.
         Login on the Oncopadi App to start your consultation at the scheduled date and time. 
          ${textHelpMesssage}.`,
        user.phone
      )
    }
  }
}
