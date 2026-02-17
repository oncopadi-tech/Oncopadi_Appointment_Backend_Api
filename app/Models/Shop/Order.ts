import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Consultation from '../Consultation/Consultation'
import User from '../People/User'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public woocommerceOrderId: number

  @column()
  public consultationId: number

  @column()
  public userId: number

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

  @belongsTo(() => Consultation)
  public consultation: BelongsTo<typeof Consultation>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
