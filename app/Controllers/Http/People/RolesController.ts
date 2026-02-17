import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/People/Role'
import Update from 'App/Repos/People/Role/Update'
import CtxExtendContract from 'Contracts/ctxExtend'

export default class RolesController {
  public async index({ request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'name',
      sortOrder = 'asc'
    } = request.get()

    var query = Role.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Role.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const role = await query.firstOrFail()

    return response.json({ status: true, role })
  }

  public async update({ params, validator, response }: CtxExtendContract) {
    const data = await validator.validate({
      name: validator.schema.string.optional(),
      attachedPermissions: validator.schema.array
        .optional()
        .members(validator.schema.number()),
      detachedPermissions: validator.schema.array
        .optional()
        .members(validator.schema.number())
    })

    const role = await new Update().handle(params.id, data)
    return response.json({ status: true, role })
  }
}
