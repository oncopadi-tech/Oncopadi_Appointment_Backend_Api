import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Activity from 'App/Models/Misc/Activity'

export default class ActivitiesController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Activity.query().orderBy(sortBy, sortOrder).preload('details')

    for (const relationship of relationships) query.preload(relationship)

    const results = await query
      .where('user_id', auth.user?.id || 0)
      .paginate(page, perPage)

    return response.json(results)
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Activity.query().where('id', params.id).preload('details')

    for (const relationship of relationships)
      query = query.preload(relationship)

    const activity = await query
      .where('user_id', auth.user?.id || 0)
      .firstOrFail()

    return response.json({ status: true, activity })
  }
}
