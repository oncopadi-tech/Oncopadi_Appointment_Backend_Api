import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Chat from 'App/Models/Chat/Chat'
import User from 'App/Models/People/User'
import UpdateChatValidator from 'App/Validators/Chats/UpdateChatValidator'

export default class UpdateChat {
  public static async handle(
    id,
    data: typeof UpdateChatValidator.props,
    auth: AuthContract | { user: User }
  ) {
    const chat = await Chat.query()
      .where('id', id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    for (const key in data) {
      if (['message'].includes(key))
        chat[key] = typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    await chat.save()

    return chat
  }
}
