import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Notification from 'App/Models/Misc/Notification'

export default class NotificationsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Notification.query()
      .orderBy(sortBy, sortOrder)
      .preload('details')

    for (const relationship of relationships) query.preload(relationship)

    const results = await query
      .where('user_id', auth.user?.id || 0)
      .paginate(page, perPage)

    return response.json(results)
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Notification.query().where('id', params.id).preload('details')

    for (const relationship of relationships)
      query = query.preload(relationship)

    const notification = await query
      .where('user_id', auth.user?.id || 0)
      .firstOrFail()

    return response.json({ status: true, notification })
  }
}
