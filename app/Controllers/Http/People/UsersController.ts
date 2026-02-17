import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/People/User'
import CreateUserValidator from 'App/Validators/People/CreateUserValidator'
import Create from 'App/Repos/People/User/Create'
import UpdateUserValidator from 'App/Validators/People/UpdateUserValidator'
import Update from 'App/Repos/People/User/Update'

export default class UsersController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      active,
      isDeleted = false,
      relationships = [],
      roles,
      page = 1,
      perPage = 10000,
      search,
      searchBy,
      sortBy = 'name',
      sortOrder = 'asc'
    } = request.get()

    var query = User.query()
      .apply((scopes) => scopes.deleted(isDeleted))
      .orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search, searchBy))

    if (typeof roles !== 'undefined')
      query.apply((scopes) => scopes.byRoles(roles))

    if (typeof active !== 'undefined')
      query.where('active', active !== 'false' && active !== false ? 1 : 0)

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    var data = await request.validate(CreateUserValidator)

    const user = await new Create().handle(data, auth)

    var token = null

    if (!auth.user) token = await auth.login(user)

    return response.json({ status: true, user, token })
  }

  public async show({ params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = User.query()
      .apply((scopes) => scopes.deleted(false))
      .where('id', params.id)
      .orWhere('phone', params.id)
      .orWhere('email', params.id)
      .orWhere('username', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const user = await query.firstOrFail()

    return response.json({ status: true, user })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateUserValidator)

    const user = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, user })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    var user = await User.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await user.delete()

    return response.json({ status: true, user })
  }

  public async restore({ params, response }: HttpContextContract) {
    const user = User.restore(params.id)

    return response.json({ status: true, user })
  }
}
