import { EventsList } from '@ioc:Adonis/Core/Event'
import Twilio from 'App/Services/Twilio/Twillio'

export default class CompleteTwilioRoom {
  async handle({ consultation }: EventsList['consultation/ended']) {
    await new Twilio().completeRoom(consultation)
  }
}
