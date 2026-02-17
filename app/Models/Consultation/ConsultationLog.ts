import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import ConsultationStatus from './ConsultationStatus'
import Consultation from './Consultation'

export default class ConsultationLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public commentId: number

  @column()
  public createdBy: number

  @column()
  public consultationId: number

  @column()
  public consultationStatusId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => Consultation)
  public consultation: BelongsTo<typeof Consultation>

  @belongsTo(() => ConsultationStatus)
  public status: BelongsTo<typeof ConsultationStatus>
}
