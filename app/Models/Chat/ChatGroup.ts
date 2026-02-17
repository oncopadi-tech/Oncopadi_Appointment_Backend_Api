import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  scope,
  hasMany,
  HasMany,
  BelongsTo,
  belongsTo,
  hasOne,
  HasOne,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Database from '@ioc:Adonis/Lucid/Database'
import Chat from './Chat'
import { search } from 'App/Helpers/Model'

export default class ChatGroup extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public active: boolean

  @column()
  public group: boolean

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Computed
   */
  @computed()
  public get meta() {
    return this.$extras
  }

  /**
   * Relationships
   */

  @manyToMany(() => User, {
    onQuery: (query) =>
      query.isRelatedQuery
        ? query.apply((scopes) => scopes.byRoles(['administrator']))
        : null
  })
  public administrators: ManyToMany<typeof User>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @manyToMany(() => User, {
    onQuery: (query) =>
      query.isRelatedQuery
        ? query.apply((scopes) => scopes.byRoles(['doctor']))
        : null
  })
  public doctors: ManyToMany<typeof User>

  @hasMany(() => Chat)
  public chats: HasMany<typeof Chat>

  @hasOne(() => Chat, {
    onQuery: (query) => query.orderBy('created_at', 'asc')
  })
  public lastChat: HasOne<typeof Chat>

  @manyToMany(() => User)
  public members: ManyToMany<typeof User>

  @manyToMany(() => User, {
    onQuery: (query) =>
      query.isRelatedQuery
        ? query.apply((scopes) => scopes.byRoles(['patient']))
        : null
  })
  public patients: ManyToMany<typeof User>

  /**
   * Scopes
   */

  public static byUser = scope((query, user?: User) => {
    const chatGroupUserQuery = Database.from('chat_group_user')
      .where('user_id', user ? user.id : 0)
      .select('chat_group_id')

    return query.whereIn('chat_groups.id', chatGroupUserQuery)
  })

  public static mutual = scope((query, mutuals: number[]) => {
    for (const mutual of mutuals) {
      const mutualChatGroupQuery = Database.from('chat_group_user')
        .where('user_id', mutual)
        .select('chat_group_id')

      query.whereIn('chat_groups.id', mutualChatGroupQuery)
    }

    return query
  })

  public static search = search(['name'], ChatGroup)
}
