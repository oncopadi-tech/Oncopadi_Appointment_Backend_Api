import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HospitalVisit from 'App/Models/Medical/HospitalVisit'
import Record from 'App/Repos/Medical/HospitalVisit/Record'
import Update from 'App/Repos/Medical/HospitalVisit/Update'
import StoreHospitalVisitValidator from 'App/Validators/Medical/StoreHospitalVisitValidator'
import UpdateHospitalVisitValidator from 'App/Validators/Medical/UpdateHospitalVisitValidator'

export default class HospitalVisitsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = HospitalVisit.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .preload('summary')
      .preload('vitals')
      .orderBy(sortBy, sortOrder)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreHospitalVisitValidator)

    const { hospitalVisit, vitals } = await new Record().handle(data, auth)

    return response.json({ status: true, hospitalVisit, vitals })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = HospitalVisit.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const hospitalVisit = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, hospitalVisit })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateHospitalVisitValidator)

    const { hospitalVisit, vitals } = await new Update().handle(
      params.id,
      data,
      auth
    )

    return response.json({ status: true, hospitalVisit, vitals })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const hospitalVisit = await HospitalVisit.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await hospitalVisit.delete()

    return response.json({ status: true, hospitalVisit })
  }
}
