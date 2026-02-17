import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import SubscriptionPlan from './SubscriptionPlan'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime()
  public usedAt: DateTime

  @column()
  public usedBy: number

  @column()
  public createdBy: number

  @column()
  public subscriptionPlanId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Computed
   */
  @computed()
  public get active() {
    return (
      this.usedAt === null &&
      this.expiresAt.toMillis() > DateTime.local().toMillis()
    )
  }

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'usedBy' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>

  /**
   * Scopes
   */

  public static active = scope((query) => {
    return query
      .whereNull('used_at')
      .where('expires_at', '>', DateTime.local().toSQL() || '')
      .where('active', true)
  })
}
