import { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import { webAppUrl } from 'Config/app'
import mailConfig from 'Config/mail'
import { getRoleCodes } from 'App/Helpers/Index'

export default class SendMail {
  async handle({ consultation }: EventsList['consultation/confirmed']) {
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
      const roleCodes = getRoleCodes(user)
      await Mail.send((message) => {
        message
          .from(mailConfig.sender)
          .to(user.email)
          .subject('Consultation Confirmed')
          .htmlView('emails/consultation/confirmed', {
            consultation,
            participant: roleCodes.includes('patient') ? doctor : patient,
            url: `${webAppUrl}/consultations/room?id=${consultation.id}`,
            user,
            date,
            time,
            webAppUrl
          })
      })
    }
  }
}
