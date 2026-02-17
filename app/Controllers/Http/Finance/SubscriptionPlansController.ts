import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SubscriptionPlan from 'App/Models/Finance/SubscriptionPlan'

export default class SubscriptionPlansController {
  public async index({ request, response }: HttpContextContract) {
    var {
      page = 1,
      perPage = 1000,
      relationships = [],
      sortBy = 'price',
      sortOrder = 'asc'
    } = request.get()

    var query = SubscriptionPlan.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = SubscriptionPlan.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const subscriptionPlan = await query.firstOrFail()

    return response.json({ status: true, subscriptionPlan })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
