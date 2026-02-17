import Chat from 'App/Models/Chat/Chat'
import User from 'App/Models/People/User'

export default class GetUnReadMessages {
  public static async handle(user: User, asCount = true) {
    const query = Chat.query().apply((scopes) => scopes.unread(user))

    return asCount ? (await query.count('id'))[0]['count(`id`)'] : await query
  }
}
