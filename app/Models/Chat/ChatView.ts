import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Chat from './Chat'

export default class ChatView extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public chatId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => Chat)
  public chat: BelongsTo<typeof Chat>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Scopes
   */

  public static byUser = scope((query, user?: User) =>
    query.where('user_id', user ? user.id : 0)
  )
}
