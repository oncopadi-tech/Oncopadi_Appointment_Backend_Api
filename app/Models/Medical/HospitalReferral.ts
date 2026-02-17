import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Consultation from '../Consultation/Consultation'
import User from '../People/User'
import Doctor from '../People/Doctor'

export default class HospitalReferral extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public comment: string

  @column()
  public consultationId: number

  @column()
  public patientId: number

  @column()
  public doctorId: number

  @column()
  public hospitalId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => Consultation)
  public consultation: BelongsTo<typeof Consultation>

  @belongsTo(() => User, { foreignKey: 'patientId' })
  public patient: BelongsTo<typeof User>

  @belongsTo(() => Doctor)
  public doctor: BelongsTo<typeof Doctor>
}
