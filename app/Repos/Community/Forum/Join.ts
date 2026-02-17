import Forum from 'App/Models/Community/Forum'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import CreateActivity from 'App/Repos/Misc/Activity/Create'

export default class Join {
  async handle(id: any, auth?: AuthContract) {
    var forum = await Forum.query()
      .where('id', id)
      .preload('members')
      .firstOrFail()

    if (!auth?.user) return forum

    const memberIds = forum.members.map((member) => member.id)

    if (!memberIds.includes(auth.user.id))
      await forum.related('members').attach([auth?.user?.id || 0])

    await new CreateActivity().handle(`You joined ${forum.name}`, auth)

    return forum
  }
}
