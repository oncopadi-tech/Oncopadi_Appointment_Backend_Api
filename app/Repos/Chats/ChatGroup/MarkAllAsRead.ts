import Chat from 'App/Models/Chat/Chat'
import ChatGroup from 'App/Models/Chat/ChatGroup'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import ChatView from 'App/Models/Chat/ChatView'

export default class MarkAllAsRead {
  async handle(id: number, auth: AuthContract) {
    const chatGroup = await ChatGroup.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .where('id', id)
      .firstOrFail()

    const unreadchats = await Chat.query()
      .where('chat_group_id', chatGroup.id)
      .apply((scopes) => scopes.unread(auth.user))

    await ChatView.createMany(
      unreadchats.map((chat) => ({
        userId: auth.user?.id,
        chatId: chat.id
      }))
    )

    return chatGroup
  }
}
