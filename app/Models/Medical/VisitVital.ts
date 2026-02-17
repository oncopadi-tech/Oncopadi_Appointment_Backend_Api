import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import HospitalVisit from './HospitalVisit'
import User from '../People/User'
import Vital from './Vital'

export default class VisitVital extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: string

  @column()
  public hospitalVisitId: number

  @column()
  public vitalId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => HospitalVisit)
  public visit: BelongsTo<typeof HospitalVisit>

  @belongsTo(() => Vital)
  public vital: BelongsTo<typeof Vital>
}
