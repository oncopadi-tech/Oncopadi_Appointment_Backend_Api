import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfileField from 'App/Models/People/ProfileField'

export default class ProfileFieldsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      categories,
      page = 1,
      perPage = 10000,
      relationships = [],
      sortBy = 'id',
      sortOrder = 'asc'
    } = request.get()

    var query = ProfileField.query()
      .where('active', true)
      .orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof categories !== 'undefined') query.whereIn('category', categories)

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = ProfileField.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const profileField = await query.firstOrFail()

    return response.json({ status: true, profileField })
  }

  public async update({}: HttpContextContract) {}
}
