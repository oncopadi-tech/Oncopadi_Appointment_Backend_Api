import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Specialty from 'App/Models/Medical/Specialty'

export default class SpecialtiesController {
  public async index({ request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'name',
      sortOrder = 'asc'
    } = request.get()

    var query = Specialty.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({}: HttpContextContract) {}

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Specialty.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const specialty = await query.firstOrFail()

    return response.json({ status: true, specialty })
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
