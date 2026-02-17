import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfileDatum from 'App/Models/People/ProfileDatum'
import SaveProfileValidator from 'App/Validators/People/SaveProfileValidator'
import Save from 'App/Repos/People/Profile/Save'

export default class ProfileDataController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      categories,
      fields,
      page = 1,
      perPage = 10000,
      relationships = [],
      sortBy = 'profile_field_id',
      sortOrder = 'asc',
      userId
    } = request.get()

    var query = ProfileDatum.query().preload('field').orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof userId !== 'undefined') {
      query.where('user_id', userId)
    } else {
      query.apply((scopes) => scopes.byUser(auth.user))
    }

    if (typeof categories !== 'undefined')
      query.apply((scopes) => scopes.byCategories(categories))

    if (typeof fields !== 'undefined')
      query.apply((scopes) => scopes.byFields(fields))

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(SaveProfileValidator)

    const profile = await new Save().handle(data, auth)

    return response.json({ status: true, ...profile })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = ProfileDatum.query().preload('field').where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const profileDatum = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, profileDatum })
  }

  public async destroy({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = ProfileDatum.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const profileDatum = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await profileDatum.delete()

    return response.json({ status: true, profileDatum })
  }
}
