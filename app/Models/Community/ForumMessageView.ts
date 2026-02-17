import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import ForumMessage from './ForumMessage'
import User from '../People/User'

export default class ForumMessageView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public forumMessageId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => ForumMessage)
  public message: BelongsTo<typeof ForumMessage>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Scopes
   */

  public static byUser = scope((query, user?: User) => {
    return query.where('user_id', user?.id || 0)
  })
}
