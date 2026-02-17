import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/People/Permission'

export default class PermissionsController {
  public async index({ request, response }: HttpContextContract) {
    var {
      page = 1,
      perPage = 10000,
      relationships = [],
      roles,
      sortBy = 'name',
      sortOrder = 'asc'
    } = request.get()

    var query = Permission.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof roles !== 'undefined')
      query.apply((scopes) => scopes.byRoles(roles))

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Permission.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const permission = await query.firstOrFail()

    return response.json({ status: true, permission })
  }
}
