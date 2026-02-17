import ForumMessage from 'App/Models/Community/ForumMessage'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class Update {
  async handle(id, { message }, auth?: AuthContract) {
    var forumMessage = await ForumMessage.query()
      .where('id', id)
      .apply((scopes) => scopes.byUser(auth?.user))
      .firstOrFail()

    forumMessage.message =
      typeof message !== 'undefined' ? message : forumMessage.message

    return forumMessage
  }
}
