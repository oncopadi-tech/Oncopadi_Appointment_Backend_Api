import Forum from 'App/Models/Community/Forum'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import CreateActivity from 'App/Repos/Misc/Activity/Create'

export default class Leave {
  async handle(id: any, auth?: AuthContract) {
    var forum = await Forum.findOrFail(id)

    await forum.related('members').detach([auth?.user?.id || 0])

    await new CreateActivity().handle(`You left ${forum.name} Forum`, auth)

    return forum
  }
}
