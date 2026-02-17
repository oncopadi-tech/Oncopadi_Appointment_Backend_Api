import ChatGroup from "App/Models/Chat/ChatGroup";
import StoreChatValidator from "App/Validators/Chats/StoreChatValidator";
import { Exception } from "@poppinss/utils";
import { AuthContract } from "@ioc:Adonis/Addons/Auth";
import User from "App/Models/People/User";
import StoreChatGroup from "../ChatGroup/StoreChatGroup";
import Chat from "App/Models/Chat/Chat";
import Event from "@ioc:Adonis/Core/Event";
import Logger from "@ioc:Adonis/Core/Logger";
import GCS from "App/Services/GCS";

export default class StoreChat {
  public static async handle(
    { message, to, chatGroupId, file }: typeof StoreChatValidator.props,
    auth: AuthContract | { user: User },
  ) {
    var chatGroup: ChatGroup | null;

    if (chatGroupId) {
      chatGroup = await ChatGroup.findOrFail(chatGroupId);
    } else if (typeof to === "undefined") {
      throw new Exception("recipient user id is required", 422);
    } else {
      chatGroup = await ChatGroup.query()
        .apply((scopes) => scopes.mutual([auth.user?.id || 0, to]))
        .where("group", false)
        .first();

      if (!chatGroup) {
        const recipient = await User.findOrFail(to);

        chatGroup = await StoreChatGroup.handle(
          {
            members: [auth.user?.id || 0, to],
            name: recipient.name,
            group: false,
          },
          auth,
        );
      }
    }

    const chat = await Chat.create({
      message,
      chatGroupId: chatGroup.id,
      createdBy: auth.user?.id,
    });

    if (file) {
      try {
        const uploadedFile = await new GCS().uploadFile(
          file,
          `chat-files/${chat.id}`,
        );
        await chat.related("files").create({
          name: file.clientName,
          path: uploadedFile.filePath,
          type: file.type,
          createdBy: auth.user?.id,
        });
      } catch (error) {
        Logger.error(error);
      }
    }

    if (!auth?.user) return chat;

    Event.emit("chat/sent", {
      chat,
      chatGroup,
      user: auth.user,
    });

    return chat;
  }
}
