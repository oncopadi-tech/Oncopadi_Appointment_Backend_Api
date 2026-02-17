import { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import { webAppUrl } from 'Config/app'
import mailConfig from 'Config/mail'

export default class SendResetCode {
  async handle({
    user,
    resetCode,
    type
  }: EventsList['password/reset-code-generated']) {
    if (type === 'email') {
      await Mail.send((message) => {
        message
          .from(mailConfig.sender)
          .to(user.email)
          .subject('Oncopadi Password Reset')
          .htmlView('emails/auth/password-reset', {
            user,
            resetCode,
            webAppUrl
          })
      })
    }
  }
}
