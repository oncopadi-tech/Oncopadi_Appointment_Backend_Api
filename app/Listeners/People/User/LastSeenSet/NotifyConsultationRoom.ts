import { EventsList } from '@ioc:Adonis/Core/Event'
import User from 'App/Models/People/User'
import Fcm from 'App/Services/Firebase/Fcm'

export default class NotifyConsultationRoom {
  public async handle({ user }: EventsList['user/last-seen-set']) {
    await user.preload('confirmedConsultations', (query) =>
      query.preload('present', (query) => query.preload('firebaseToken'))
    )

    const others = user.confirmedConsultations.reduce(
      (all, consultation) => all.concat(consultation.present),
      new Array<User>()
    )

    const fcm = new Fcm('app')

    for (const person of others) {
      fcm.send({
        token: person.firebaseToken,
        data: {
          user: JSON.stringify({
            id: user.id,
            name: user.name,
            image: user.image
          }),
          type: 'consultation'
        }
      })
    }
  }
}
