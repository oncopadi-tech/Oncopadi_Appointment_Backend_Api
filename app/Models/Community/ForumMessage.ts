import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Forum from './Forum'
import { getRoleCodes } from 'App/Helpers/Index'
import Database from '@ioc:Adonis/Lucid/Database'
import { search } from 'App/Helpers/Model'

export default class ForumMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public message: string

  @column()
  public forumId: number

  @column()
  public replyTo: number

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Forum)
  public forum: BelongsTo<typeof Forum>

  @belongsTo(() => ForumMessage, { foreignKey: 'replyTo' })
  public parent: BelongsTo<typeof ForumMessage>

  @hasMany(() => ForumMessage, { foreignKey: 'replyTo' })
  public replies: HasMany<typeof ForumMessage>

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    const forumUserQuery = Database.from('forum_user')
      .where('user_id', user?.id || 0)
      .select('forum_id')

    return query.whereIn('forum_id', forumUserQuery)
  })

  public static search = search(['message'], ForumMessage)
}
