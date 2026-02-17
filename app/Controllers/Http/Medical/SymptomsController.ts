import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Symptom from 'App/Models/Medical/Symptom'
import Create from 'App/Repos/Medical/Symptom/Create'
import Update from 'App/Repos/Medical/Symptom/Update'
import StoreSymptomValidator from 'App/Validators/Medical/StoreSymptomValidator'
import UpdateSymptomValidator from 'App/Validators/Medical/UpdateSymptomValidator'

export default class SymptomsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = Symptom.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .orderBy(sortBy, sortOrder)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreSymptomValidator)

    const symptom = await new Create().handle(data, auth)

    return response.json({ status: true, symptom })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Symptom.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const symptom = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, symptom })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateSymptomValidator)

    const symptom = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, symptom })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const symptom = await Symptom.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await symptom.delete()

    return response.json({ status: true, symptom })
  }
}
