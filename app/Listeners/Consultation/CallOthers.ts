import { EventsList } from '@ioc:Adonis/Core/Event'
import Fcm from 'App/Services/Firebase/Fcm'

export default class CallOthers {
  async handle({ consultation, user }: EventsList['consultation/started']) {
    await consultation.preload('people', (query) =>
      query.preload('firebaseToken')
    )

    const others = consultation.people.filter((person) => person.id !== user.id)

    for (const person of others) {
      if (!person.firebaseToken) continue
      const fcm = new Fcm(person.firebaseToken.app)

      fcm.send({
        token: person.firebaseToken,
        data: {
          consultation: JSON.stringify({
            id: consultation.id,
            enquiry: consultation.enquiry
          }),
          type: 'consultation'
        },
        title: `${user.name} started ${consultation.enquiry}`
      })
    }
  }
}
