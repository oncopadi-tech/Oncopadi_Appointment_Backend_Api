import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MedicalFile from 'App/Models/Medical/MedicalFile'
import Create from 'App/Repos/Medical/MedicalFile/Create'
import Delete from 'App/Repos/Medical/MedicalFile/Delete'
import Update from 'App/Repos/Medical/MedicalFile/Update'
import StoreMedicalFileValidator from 'App/Validators/Medical/StoreMedicalFileValidator'
import UpdateMedicalFileValidator from 'App/Validators/Medical/UpdateMedicalFileValidator'

export default class MedicalFilesController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 100,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = MedicalFile.query()
      .apply((scopes) => scopes.byUser(auth.user))
      .preload('file')
      .orderBy(sortBy, sortOrder)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    for (const relationship of relationships) query.preload(relationship)

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreMedicalFileValidator)

    const medicalFile = await new Create().handle(data, auth)

    return response.json({ status: true, medicalFile })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = MedicalFile.query().where('id', params.id).preload('file')

    for (const relationship of relationships)
      query = query.preload(relationship)

    const medicalFile = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, medicalFile })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateMedicalFileValidator)

    const medicalFile = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, medicalFile })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const medicalFile = await new Delete().handle(params.id, auth)

    return response.json({ status: true, medicalFile })
  }
}
