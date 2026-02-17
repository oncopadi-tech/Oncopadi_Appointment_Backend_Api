import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MedicalCondition from 'App/Models/Medical/MedicalCondition'
import Create from 'App/Repos/Medical/MedicalCondition/Create'
import Update from 'App/Repos/Medical/MedicalCondition/Update'
import StoreMedicalConditionValidator from 'App/Validators/Medical/StoreMedicalConditionValidator'
import UpdateMedicalConditionValidator from 'App/Validators/Medical/UpdateMedicalConditionValidator'

export default class MedicalConditionsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = MedicalCondition.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .orderBy(sortBy, sortOrder)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreMedicalConditionValidator)

    const medicalCondition = await new Create().handle(data, auth)

    return response.json({ status: true, medicalCondition })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = MedicalCondition.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const medicalCondition = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, medicalCondition })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateMedicalConditionValidator)

    const medicalCondition = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, medicalCondition })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const medicalCondition = await MedicalCondition.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await medicalCondition.delete()

    return response.json({ status: true, medicalCondition })
  }
}
