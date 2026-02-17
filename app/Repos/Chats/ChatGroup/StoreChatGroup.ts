import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import ChatGroup from 'App/Models/Chat/ChatGroup'
import User from 'App/Models/People/User'
import StoreChatGroupValidator from 'App/Validators/Chats/StoreChatGroupValidator'

export default class StoreChatGroup {
  public static async handle(
    { name, group, members }: typeof StoreChatGroupValidator.props,
    auth: AuthContract | { user: User }
  ) {
    const chatGroup = await ChatGroup.create({
      name,
      group,
      createdBy: auth.user?.id
    })

    await chatGroup.related('members').sync(members)

    return chatGroup
  }
}
