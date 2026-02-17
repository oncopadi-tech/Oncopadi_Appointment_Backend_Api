import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import ChatGroup from 'App/Models/Chat/ChatGroup'
import User from 'App/Models/People/User'
import UpdateChatGroupValidator from 'App/Validators/Chats/UpdateChatGroupValidator'

export default class UpdateChatGroup {
  public static async handle(
    id,
    data: typeof UpdateChatGroupValidator.props,
    auth: AuthContract | { user: User }
  ) {
    const chatGroup = await ChatGroup.query()
      .where('id', id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    for (const key in data) {
      if (['name', 'group'].includes(key))
        chatGroup[key] =
          typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    await chatGroup.save()

    if (typeof data.addMembers !== 'undefined')
      await chatGroup.related('members').attach(data.addMembers)

    if (typeof data.removeMembers !== 'undefined') {
      if (data.removeMembers.length > 0) {
        await chatGroup.related('members').detach(data.removeMembers)
      }
    }

    return chatGroup
  }
}
