import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  computed
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Subscription from './Subscription'
import Coupon from './Coupon'

export default class SubscriptionPlan extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column({ serializeAs: null })
  public accessCode: string

  @column({
    serialize: (value) => value.split(',').map((feature) => feature.trim())
  })
  public features: string

  @column()
  public numberOfDays: number

  @column()
  public price: number

  @column()
  public currency: string

  @column()
  public discount: number

  @column()
  public active: boolean

  @column()
  public createdBy: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Computed
   */
  @computed()
  public get hasAccessCode() {
    return this.accessCode ? true : false
  }

  @computed()
  public get discountedPrice() {
    return this.price - this.price * this.discount
  }

  /**
   * Relationships
   */

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @hasMany(() => Coupon)
  public coupons: HasMany<typeof Coupon>

  @hasMany(() => Subscription, {
    onQuery: (query) =>
      query
        .where('starts_at', '<', DateTime.fromMillis(Date.now()).toSQL() || 0)
        .where('ends_at', '>', DateTime.fromMillis(Date.now()).toSQL() || 0)
  })
  public subscriptions: HasMany<typeof Subscription>
}
