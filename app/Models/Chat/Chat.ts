import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
  scope,
} from "@ioc:Adonis/Lucid/Orm";
import ChatGroup from "./ChatGroup";
import User from "App/Models/People/User";
//"../People/User";
import ChatView from "./ChatView";
import { search } from "App/Helpers/Model";
import File from "../Misc/File";
import Database from "@ioc:Adonis/Lucid/Database";
export default class Chat extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public message: string;

  @column()
  public chatGroupId: number;

  @column()
  public createdBy: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  /**
   * Relationships
   */
  @belongsTo(() => ChatGroup)
  public chatGroup: BelongsTo<typeof ChatGroup>;

  @belongsTo(() => User, { foreignKey: "createdBy" })
  public creator: BelongsTo<typeof User>;

  @manyToMany(() => File)
  public files: ManyToMany<typeof File>;

  @manyToMany(() => User, { pivotTable: "chat_views" })
  public viewers: ManyToMany<typeof User>;

  @hasMany(() => ChatView)
  public views: HasMany<typeof ChatView>;

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const chatGroupUserQuery = Database.from("chat_group_user")
      .where("user_id", user ? user.id : 0)
      .select("chat_group_user.chat_group_id");

    return query.whereIn("chats.chat_group_id", chatGroupUserQuery);
  });

  // public static byUser = scope((query, user: User) => {
  //   const chatGroupUserQuery = Database.from("chat_group_user")
  //     .where("user_id", user.id)
  //     .select("chat_group_id");

  //   return query.whereIn("chats.chat_group_id", chatGroupUserQuery);
  // });

  public static mutual = scope((query, mutuals: number[]) => {
    const chatGroupQuery = ChatGroup.query()
      .apply((scopes) => scopes.mutual(mutuals))
      .select("id");

    return query.whereIn("chat_group_id", chatGroupQuery);
  });

  public static search = search(["message"], Chat);

  public static unread = scope((query, user?: User, read = false) => {
    const chatViewsQuery = Database.from("chat_views")
      .where("user_id", user?.id || 0)
      .select("chat_id");

    const chatGroupsQuery = Database.from("chat_group_user")
      .where("user_id", user?.id || 0)
      .select("chat_group_id");

    query.whereIn("chat_group_id", chatGroupsQuery);

    read
      ? query.whereIn("chats.id", chatViewsQuery)
      : query
          .whereNotIn("chats.id", chatViewsQuery)
          .whereNot("created_by", user?.id || 0);
  });
}
