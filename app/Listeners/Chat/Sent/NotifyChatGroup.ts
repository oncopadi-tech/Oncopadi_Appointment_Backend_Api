import { EventsList } from '@ioc:Adonis/Core/Event'
import Fcm from 'App/Services/Firebase/Fcm'

export default class NotifyChatGroup {
  async handle({ chat, chatGroup, user }: EventsList['chat/sent']) {
    await chatGroup.preload('members', (query) =>
      query.preload('firebaseToken')
    )

    const fcm = new Fcm('app')

    const others = chatGroup.members.filter((person) => person.id !== user.id)

    for (const person of others) {
      fcm.send({
        token: person.firebaseToken,
        data: {
          chat: JSON.stringify({
            message: chat.message,
            creator: { id: user.id, name: user.name, image: user.image },
            created_at: chat.createdAt.toISO()
          }),
          type: 'chat'
        },
        title: user.name,
        body: chat.message
      })
    }
  }
}
