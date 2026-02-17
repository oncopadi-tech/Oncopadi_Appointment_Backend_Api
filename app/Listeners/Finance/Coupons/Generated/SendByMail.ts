import { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import mailConfig from 'Config/mail'

export default class SendByMail {
  async handle({
    coupons,
    subscriptionPlan,
    user
  }: EventsList['coupons/genrated']) {
    Mail.send((message) => {
      message
        .from(mailConfig.sender)
        .to(user.email)
        .subject('Coupons Generated')
        .htmlView('emails/finance/coupons/generated', {
          user,
          subscriptionPlan,
          coupons
        })
    })
  }
}
