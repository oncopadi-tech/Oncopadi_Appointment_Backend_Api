import CreateComment from 'App/Repos/Misc/Comment/Create'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import User from 'App/Models/People/User'
import Notification from 'App/Models/Misc/Notification'
import Event from '@ioc:Adonis/Core/Event'

export default class Create {
  async handle(title, auth?: AuthContract | { user: User }) {
    const comment = await new CreateComment().handle({ title }, auth)

    const notification = await Notification.create({
      commentId: comment.id,
      userId: auth?.user?.id || 0
    })

    Event.emit('notifications/created', notification)

    return notification
  }
}
