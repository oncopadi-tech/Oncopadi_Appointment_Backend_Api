import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Doctor from '../People/Doctor'
import Hospital from '../Places/Hospital'
import User from '../People/User'
import MedicalCondition from './MedicalCondition'

export default class Treatment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public details: string

  @column.dateTime()
  public date: DateTime

  @column()
  public medicalConditionId: number

  @column()
  public doctorId: number

  @column()
  public hospitalId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => MedicalCondition)
  public condition: BelongsTo<typeof MedicalCondition>

  @belongsTo(() => Doctor)
  public doctor: BelongsTo<typeof Doctor>

  @belongsTo(() => Hospital)
  public hospital: BelongsTo<typeof Hospital>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
