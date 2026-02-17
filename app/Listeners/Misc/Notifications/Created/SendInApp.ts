import { EventsList } from '@ioc:Adonis/Core/Event'
import Fcm from 'App/Services/Firebase/Fcm'

export default class SendInApp {
  async handle(notification: EventsList['notifications/created']) {
    await Promise.all([
      notification.preload('details'),
      notification.preload('user', (query) => query.preload('firebaseToken'))
    ])

    if (!notification.user.firebaseToken) return

    await new Fcm(notification.user.firebaseToken.app).send({
      token: notification.user.firebaseToken,
      data: {
        notification: JSON.stringify({
          title: notification.details.title,
          created_at: notification.createdAt.toISO()
        }),
        type: 'notification'
      },
      title: notification.details.title
    })
  }
}
