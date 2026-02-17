import { EventsList } from '@ioc:Adonis/Core/Event'
import User from 'App/Models/People/User'
import Mail from '@ioc:Adonis/Addons/Mail'
import { webAppUrl } from 'Config/app'
import mailConfig from 'Config/mail'
import { toMoney } from 'App/Helpers/Index'

export default class SendMail {
  async handle({ consultation, user }: EventsList['consultation/paid']) {
    await consultation.preload('confirmedPayments')
    const administrators = await User.query().apply((scopes) =>
      scopes.byRoles(['administrator'])
    )

    const date = consultation.startsAt.toLocaleString()
    const time = consultation.startsAt.toLocaleString({
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    await Mail.send((message) => {
      message
        .from(mailConfig.sender)
        .to(user.email)
        .subject('Your Consultation booking request has been made')
        .htmlView('emails/consultation/paid', {
          consultation,
          amount: toMoney(consultation.confirmedPayments[0]?.amount || 0),
          date,
          time,
          user,
          webAppUrl
        })
    })

    for (const admin of administrators) {
      await Mail.send((message) => {
        message
          .from(mailConfig.sender)
          .to(admin.email)
          .subject('Consultation Paid')
          .htmlView('emails/consultation/paid', {
            consultation,
            amount: toMoney(consultation.confirmedPayments[0]?.amount),
            user,
            date,
            time,
            webAppUrl
          })
      })
    }
  }
}
