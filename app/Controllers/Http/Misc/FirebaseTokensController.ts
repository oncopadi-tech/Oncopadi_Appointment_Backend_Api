import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FirebaseToken from 'App/Models/Misc/FirebaseToken'
import CreateOrUpdateFirebaseTokenValidator from 'App/Validators/Misc/CreateOrUpdateFirebaseTokenValidator'
import CreateOrUpdate from 'App/Repos/Misc/FirebaseToken/CreateOrUpdate'

export default class FirebaseTokensController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      relationships = [],
      page = 1,
      perPage = 10000,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userId
    } = request.get()

    var query = FirebaseToken.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof userId !== 'undefined') query.where('user_id', userId)

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(CreateOrUpdateFirebaseTokenValidator)

    const firebaseToken = await new CreateOrUpdate().handle(data, auth)

    return response.json({ status: true, firebaseToken })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = FirebaseToken.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const firebaseToken = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, firebaseToken })
  }
}
