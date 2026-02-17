import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  scope,
  hasMany,
  HasMany
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import { getRoleCodes } from 'App/Helpers/Index'

export default class Enquiry extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public title: string

  @column()
  public message: string

  @column()
  public createdBy: number

  @column.dateTime()
  public seenAt: DateTime

  @column()
  public replyTo: number

  @column()
  public sentTo: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User, {
    foreignKey: 'createdBy',
    onQuery: (query) => (query.isRelatedQuery ? query.preload('roles') : query)
  })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Enquiry, { foreignKey: 'replyTo' })
  public parent: BelongsTo<typeof Enquiry>

  @hasMany(() => Enquiry, { foreignKey: 'replyTo' })
  public replies: HasMany<typeof Enquiry>

  @belongsTo(() => User, {
    foreignKey: 'sentTo',
    onQuery: (query) => (query.isRelatedQuery ? query.preload('roles') : query)
  })
  public to: BelongsTo<typeof User>

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
      return query.whereNull('reply_to')

    return query.where('sent_to', user?.id || 0)
  })
}
