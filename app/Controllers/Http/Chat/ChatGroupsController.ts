import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChatGroup from 'App/Models/Chat/ChatGroup'
import MarkAllAsRead from 'App/Repos/Chats/ChatGroup/MarkAllAsRead'
import StoreChatGroup from 'App/Repos/Chats/ChatGroup/StoreChatGroup'
import UpdateChatGroup from 'App/Repos/Chats/ChatGroup/UpdateChatGroup'
import StoreChatGroupValidator from 'App/Validators/Chats/StoreChatGroupValidator'
import UpdateChatGroupValidator from 'App/Validators/Chats/UpdateChatGroupValidator'

export default class ChatGroupsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      chatGroupId,
      mutuals,
      page = 1,
      perPage = 10000,
      relationships = [],
      relationshipCounts = [],
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = request.get()

    var query = ChatGroup.query().orderBy(sortBy, sortOrder)

    for (const relationship of relationships) query.preload(relationship)

    for (const relationship of relationshipCounts) {
      if (relationship === 'unread') {
        query.withCount('chats', (countQuery) => {
          countQuery
            .apply((scopes) => scopes.unread(auth.user))
            .as(`${relationship}Count`)
        })
      } else {
        query.withCount(relationship, (countQuery) =>
          countQuery.as(`${relationship}Count`)
        )
      }
    }

    if (typeof chatGroupId !== 'undefined')
      query.where('chat_group_id', chatGroupId)

    if (typeof search !== 'undefined')
      query.apply((scopes) => scopes.search(search))

    if (typeof mutuals !== 'undefined')
      query.apply((scopes) => scopes.mutual(mutuals))

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage)

    return response.json(results)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreChatGroupValidator)

    const chatGroup = await StoreChatGroup.handle(data, auth)

    return response.json({ status: true, chatGroup })
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [], relationshipCounts = [] } = request.get()

    var query = ChatGroup.query().where('id', params.id)

    for (const relationship of relationships)
      query = query.preload(relationship)

    for (const relationship of relationshipCounts) {
      if (relationship === 'unread') {
        query.withCount('chats', (countQuery) => {
          countQuery
            .apply((scopes) => scopes.unread(auth.user))
            .as(`${relationship}Count`)
        })
      } else {
        query.withCount(relationship, (countQuery) =>
          countQuery.as(`${relationship}Count`)
        )
      }
    }

    const chatGroup = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    return response.json({ status: true, chatGroup })
  }

  public async update({
    auth,
    params,
    request,
    response
  }: HttpContextContract) {
    const data = await request.validate(UpdateChatGroupValidator)

    const chatGroup = await UpdateChatGroup.handle(params.id, data, auth)

    return response.json({ status: true, chatGroup })
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const chatGroup = await ChatGroup.query()
      .where('id', params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail()

    await chatGroup.delete()

    return response.json({ status: true, chatGroup })
  }

  public async markAllAsRead({ auth, params, response }: HttpContextContract) {
    const chatGroup = await new MarkAllAsRead().handle(params.id, auth)

    return response.json({ status: true, chatGroup })
  }
}
