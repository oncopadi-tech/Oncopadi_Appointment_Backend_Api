import { EventsList } from '@ioc:Adonis/Core/Event'
import AfricasTalking from 'App/Services/AfricasTalking/AfricasTalking'
import { textHelpMesssage } from 'Config/oncopadi'

export default class SendSMS {
  async handle({ consultation, user }: EventsList['consultation/paid']) {
    await consultation.preload('confirmedPayments')

    if (!user.phone) return

    const date = consultation.startsAt.toLocaleString()
    const time = consultation.startsAt.toLocaleString({
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })

    await new AfricasTalking().sendSMS(
      `Hi, your video consultation for ${date} at ${time} has been booked. You will receive an update upon confirmation of your consultation from your doctor. 
      ${textHelpMesssage}`,
      user.phone
    )
  }
}
