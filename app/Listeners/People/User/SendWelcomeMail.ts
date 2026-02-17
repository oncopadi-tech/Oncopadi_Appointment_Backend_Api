import { EventsList } from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import { webAppUrl } from 'Config/app'
import mailConfig from 'Config/mail'

export default class SendWelcomeMail {
  async handle({ password, user }: EventsList['user/created']) {
    await Mail.send((message) => {
      message
        .from(mailConfig.sender)
        .to(user.email)
        .subject('Welcome To Oncopadi')
        .htmlView('emails/people/welcome', { user, password, webAppUrl })
    })
  }
}
