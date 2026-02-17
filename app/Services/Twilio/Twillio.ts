import TwilioPkg, { jwt } from 'twilio'
import User from 'App/Models/People/User'
import Consultation from 'App/Models/Consultation/Consultation'
import twilioConfig from 'Config/twilio'
import logger from '@ioc:Adonis/Core/Logger'

export default class Twilio {
  private client
  constructor() {
    this.client = TwilioPkg(twilioConfig.accountSid, twilioConfig.authToken)
  }

  public async getToken({
    user,
    consultation
  }: {
    user?: User
    consultation: Consultation
  }) {
    const token = new jwt.AccessToken(
      twilioConfig.accountSid,
      twilioConfig.apiKey,
      twilioConfig.apiSecret
    )

    token['identity'] = `user-${user?.id}`

    const twilioRoom = await this.getOrCreateRoom(consultation)

    const videoGrant = new jwt.AccessToken.VideoGrant({
      room: twilioRoom.name
    })

    token.addGrant(videoGrant)

    return { token: token.toJwt(), twilioRoom }
  }

  public async completeRoom(consultation: Consultation) {
    await consultation.preload('twilioRoom')

    try {
      if (consultation.twilioRoom) {
        await this.client.video
          .rooms(consultation.twilioRoom.sid)
          .update({ status: 'completed' })
      }
    } catch (error) {
      logger.error('could not complete room', error)
    }
  }

  public async getOrCreateRoom(consultation: Consultation) {
    await consultation.preload('twilioRoom')

    const uniqueName = `oncopadi-consultation-${consultation.id}`
    var twilioRoom

    if (consultation.twilioRoom) {
      try {
        twilioRoom = await this.client.video.rooms(uniqueName).fetch()
      } catch (error) {
        twilioRoom = await this.createRoom(consultation)
      }
    } else {
      twilioRoom = await this.createRoom(consultation)
    }

    return consultation
      .related('twilioRoom')
      .updateOrCreate({ name: uniqueName }, { sid: twilioRoom.sid })
  }

  public async createRoom(consultation: Consultation) {
    const uniqueName = `oncopadi-consultation-${consultation.id}`

    return await this.client.video.rooms.create({
      enableTurn: true,
      type: twilioConfig.roomType,
      uniqueName
    })
  }
}
