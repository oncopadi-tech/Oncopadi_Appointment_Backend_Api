import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Chat from "App/Models/Chat/Chat";
import StoreChat from "App/Repos/Chats/Chat/StoreChat";
import UpdateChat from "App/Repos/Chats/Chat/UpdateChat";
import StoreChatValidator from "App/Validators/Chats/StoreChatValidator";
import UpdateChatValidator from "App/Validators/Chats/UpdateChatValidator";

export default class ChatsController {
  public async index({ auth, request, response }: HttpContextContract) {
    var {
      chatGroupId,
      mutuals,
      page = 1,
      perPage = 10000,
      relationships = [],
      search,
      sortBy = "created_at",
      sortOrder = "desc",
    } = request.get();

    var query = Chat.query().orderBy(sortBy, sortOrder).preload("files");

    for (const relationship of relationships) query.preload(relationship);

    if (typeof chatGroupId !== "undefined")
      query.where("chat_group_id", chatGroupId);

    if (typeof mutuals !== "undefined")
      query.apply((scopes) => scopes.mutual(mutuals));

    if (typeof search !== "undefined")
      query.apply((scopes) => scopes.search(search));

    const results = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .paginate(page, perPage);

    return response.json(results);
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(StoreChatValidator);

    const chat = await StoreChat.handle(data, auth);

    return response.json({ status: true, chat });
  }

  public async show({ auth, params, request, response }: HttpContextContract) {
    const { relationships = [] } = request.get();

    var query = Chat.query().where("id", params.id);

    for (const relationship of relationships)
      query = query.preload(relationship);

    const chat = await query
      .apply((scopes) => scopes.byUser(auth.user))
      .firstOrFail();

    return response.json({ status: true, chat });
  }

  public async update({
    auth,
    params,
    request,
    response,
  }: HttpContextContract) {
    const data = await request.validate(UpdateChatValidator);

    const chat = await UpdateChat.handle(params.id, data, auth);

    return response.json({ status: true, chat });
  }

  public async destroy({ auth, params, response }: HttpContextContract) {
    const chat = await Chat.query()
      .where("id", params.id)
      .apply((scopes) => scopes.byUser(auth.user))
      .where("created_by", auth.user?.id || 0)
      .firstOrFail();

    await chat.delete();

    return response.json({ status: true, chat });
  }
}
