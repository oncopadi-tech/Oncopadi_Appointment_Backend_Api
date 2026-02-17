import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment'
import User from '../People/User'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public commentId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => Comment)
  public details: BelongsTo<typeof Comment>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
