import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Forum from 'App/Models/Community/Forum'
import CtxExtendContract from 'Contracts/ctxExtend'
import Create from 'App/Repos/Community/Forum/Create'
import Update from 'App/Repos/Community/Forum/Update'
import Join from 'App/Repos/Community/Forum/Join'
import Leave from 'App/Repos/Community/Forum/Leave'

export default class ForumsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      isMember,
      page = 1,
      perPage = 10000,
      relationships = [],
      relationshipCounts = [],
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = Forum.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships.filter((r) => r !== 'messages'))
      query.preload(relationship)

    for (const relationship of relationshipCounts)
      query.withCount(relationship, (countQuery) =>
        countQuery.as(`${relationship}Count`)
      )

    if (typeof isMember !== 'undefined')
      query.apply((scopes) => scopes.isMember({ isMember, user: auth.user }))

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search))

    const results = await query.paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, response, validator }: CtxExtendContract) {
    const data = await validator.validate({
      name: validator.schema.string(),
      description: validator.schema.string.optional()
    })

    const forum = await new Create().handle(data, auth)

    return response.json({ status: true, forum })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [], relationshipCounts = [] } = request.get()

    var query = Forum.query().where('forums.id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    for (const relationship of relationshipCounts)
      query.withCount(relationship, (countQuery) =>
        countQuery.as(`${relationship}Count`)
      )

    query.withCount('members', (memberQuery) =>
      memberQuery
        .where('users.id', auth.user?.id || 0)
        .apply((query) => query.inForum([params.id]))
        .as('isMember')
    )

    const forum = await query.firstOrFail()

    return response.json({ status: true, forum })
  }

  public async update({
    auth,
    params,
    response,
    validator
  }: CtxExtendContract) {
    const data = await validator.validate({
      name: validator.schema.string.optional(),
      description: validator.schema.string.optional(),
      active: validator.schema.boolean.optional()
    })

    const forum = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, forum })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    var forum = await Forum.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await forum.delete()

    return response.json({ status: true, forum })
  }

  public async restore({ params, response }: HttpContextContract) {
    const user = Forum.restore(params.id)

    return response.json({ status: true, user })
  }

  public async join({ auth, params, response }: HttpContextContract) {
    const forum = await new Join().handle(params.id, auth)

    return response.json({ status: true, forum })
  }

  public async leave({ auth, params, response }: HttpContextContract) {
    const forum = await new Leave().handle(params.id, auth)

    return response.json({ status: true, forum })
  }
}
