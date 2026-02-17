import { slugify } from 'App/Helpers/Index'
import Forum from 'App/Models/Community/Forum'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'

export default class Create {
  async handle(
    { name, description }: { name: string; description?: string },
    auth?: AuthContract
  ) {
    const slug = slugify(name)

    const forum = await Forum.firstOrCreate(
      { slug },
      { name, description, createdBy: auth?.user?.id }
    )

    return forum
  }
}
