import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import PaymentMethod from './PaymentMethod'
import User from '../People/User'
import Consultation from '../Consultation/Consultation'
import { getRoleCodes } from 'App/Helpers/Index'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: number

  @column()
  public currency: string

  @column()
  public reference: string

  @column.dateTime()
  public confirmedAt: DateTime

  @column()
  public createdBy: number

  @column()
  public paymentMethodId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @manyToMany(() => Consultation)
  public consultations: ManyToMany<typeof Consultation>

  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => PaymentMethod)
  public method: BelongsTo<typeof PaymentMethod>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    return query.where('id', user?.id || 0)
  })
}
