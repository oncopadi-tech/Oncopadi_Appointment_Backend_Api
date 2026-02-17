import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForumMessage from 'App/Models/Community/ForumMessage'
import CtxExtendContract from 'Contracts/ctxExtend'
import Create from 'App/Repos/Community/ForumMessage/Create'
import Update from 'App/Repos/Community/ForumMessage/Update'

export default class ForumMessagesController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      forumId,
      page = 1,
      perPage = 10000,
      relationships = [],
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = ForumMessage.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    if (typeof forumId !== 'undefined') query.where('forum_id', forumId)

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search))

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, response, validator }: CtxExtendContract) {
    const data = await validator.validate({
      message: validator.schema.string(),
      forumId: validator.schema.number([
        validator.rules.exists({ table: 'forums', column: 'id' })
      ])
    })

    const forumMessage = await new Create().handle(data, auth)

    return response.json({ status: true, forumMessage })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get()

    var query = ForumMessage.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    const forumMessage = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, forumMessage })
  }

  public async update({
    auth,
    params,
    response,
    validator
  }: CtxExtendContract) {
    const data = await validator.validate({
      message: validator.schema.string()
    })

    const forumMessage = await new Update().handle(params.id, data, auth)

    return response.json({ status: true, forumMessage })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    var forumMessage = await ForumMessage.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await forumMessage.delete()

    return response.json({ status: true, forumMessage })
  }
}
