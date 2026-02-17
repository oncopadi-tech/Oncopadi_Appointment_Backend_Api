import { EventsList } from '@ioc:Adonis/Core/Event'
import Fcm from 'App/Services/Firebase/Fcm'

export default class NotifyForum {
  async handle({
    forumMessage,
    forum,
    user
  }: EventsList['forum-message/created']) {
    const others = forum.members.filter((person) => person.id !== user.id)

    const fcm = new Fcm('app')

    for (const person of others) {
      fcm.send({
        token: person.firebaseToken,
        data: {
          forumMessage: JSON.stringify({
            message: forumMessage.message,
            creator: { id: user.id, name: user.name, image: user.image },
            created_at: forumMessage.createdAt.toISO()
          }),
          type: 'forum'
        },
        title: `${user.name} at ${forum.name}`,
        body: forumMessage.message
      })
    }
  }
}
