import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Medication from 'App/Models/Medical/Medication'
import Create from 'App/Repos/Medical/Medication/Create'
import Update from 'App/Repos/Medical/Medication/Update'
import StoreMedicationValidator from 'App/Validators/Medical/StoreMedicationValidator'
import UpdateMedicationValidator from 'App/Validators/Medical/UpdateMedicationValidator'

export default class MedicationsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = Medication.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .orderBy(sortBy, sortOrder)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreMedicationValidator)

    const medications = await new Create().handle(data, auth)

    return response.json({ status: true, medications })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Medication.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const medication = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, medication })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateMedicationValidator)

    const medication = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, medication })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const medication = await Medication.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await medication.delete()

    return response.json({ status: true, medication })
  }
}
