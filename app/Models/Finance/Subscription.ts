import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import SubscriptionPlan from './SubscriptionPlan'

export default class Subscription extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public startsAt: DateTime

  @column.dateTime()
  public endssAt: DateTime

  @column()
  public consultationsLeft: number

  @column()
  public subscriptionPlanId: number

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

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
