import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public text: string

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'cretedBy' })
  public creator: BelongsTo<typeof User>
}
