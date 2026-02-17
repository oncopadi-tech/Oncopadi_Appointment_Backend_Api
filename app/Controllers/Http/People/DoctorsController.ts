import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Doctor from 'App/Models/People/Doctor'
import CreateDoctorValidator from 'App/Validators/People/CreateDoctorValidator'
import Create from 'App/Repos/People/Doctor/Create'
import UpdateDoctorValidator from 'App/Validators/People/UpdateDoctorValidator'
import Update from 'App/Repos/People/Doctor/Update'

export default class DoctorsController {
  public async index({ request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Doctor.query()
      .orderBy(sortBy, sortOrder)
      .whereNotNull('user_id')

    for (const relationship of relationships) query.preload(relationship)

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search))

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(CreateDoctorValidator)

    const doctor = await new Create().handle(data, auth)

    return response.json({ status: true, doctor })
  }

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = Doctor.query()
      .where('id', params.id)
      .orWhere('folio_number', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const doctor = await query.firstOrFail()

    return response.json({ status: true, doctor })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateDoctorValidator)

    const doctor = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, doctor })
  }

  public async destroy({ params, response }: HttpContextContract) {
    var doctor = await Doctor.query()
      .where('id', params.id)
      .orWhere('folio_number', params.id)
      .firstOrFail()

    doctor.active = false
    await doctor.save()

    return response.json({ status: true, doctor })
  }
}
