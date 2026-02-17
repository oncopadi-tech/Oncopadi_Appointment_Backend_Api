import ForumMessage from 'App/Models/Community/ForumMessage'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import Event from '@ioc:Adonis/Core/Event'
import Forum from 'App/Models/Community/Forum'

export default class Create {
  async handle(
    { message, forumId }: { message: string; forumId: number },
    auth?: AuthContract
  ) {
    var forum = await Forum.query()
      .where('id', forumId)
      .apply((scopes) => scopes.byUser(auth?.user))
      .preload('members', (query) => query.preload('firebaseToken'))
      .firstOrFail()

    const forumMessage = await ForumMessage.create({
      message,
      forumId,
      createdBy: auth?.user?.id
    })

    if (!auth?.user) return forumMessage

    Event.emit('forum-message/created', {
      forumMessage,
      forum,
      user: auth.user
    })

    return forumMessage
  }
}
