import Forum from 'App/Models/Community/Forum'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class Update {
  async handle(
    id: any,
    data: { name?: string; description?: string; active?: boolean },
    auth?: AuthContract
  ) {
    var forum = await Forum.query()
      .where('id', id)
      .apply((scopes) => scopes.byUser(auth?.user))
      .firstOrFail()

    for (const key in data) {
      if (['name', 'description', 'active'].includes(key))
        forum[key] = typeof data[key] !== 'undefined' ? data[key] : data[key]
    }

    await forum.save()

    return forum
  }
}
