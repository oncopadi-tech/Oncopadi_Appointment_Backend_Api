import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Consultation from './Consultation'
import User from '../People/User'

export default class ConsultationAttendance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column({ isPrimary: true })
  public consultationId: number

  @column.dateTime()
  public joinedAt: DateTime

  @column.dateTime()
  public leftAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => Consultation)
  public consultation: BelongsTo<typeof Consultation>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
