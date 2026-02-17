import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo,
  hasMany,
  HasMany,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import Doctor from '../People/Doctor'
import User from '../People/User'
import Hospital from '../Places/Hospital'
import Comment from '../Misc/Comment'
import VisitVital from './VisitVital'
import { getRoleCodes } from 'App/Helpers/Index'

export default class HospitalVisit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public date: DateTime

  @column()
  public commentId: number

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

  @belongsTo(() => Comment)
  public summary: BelongsTo<typeof Comment>

  @belongsTo(() => Doctor)
  public doctor: BelongsTo<typeof Doctor>

  @belongsTo(() => Hospital)
  public hospital: BelongsTo<typeof Hospital>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasMany(() => VisitVital, {
    onQuery: (query) => (query.isRelatedQuery ? query.preload('vital') : query)
  })
  public vitals: HasMany<typeof VisitVital>

  /**
   * Scopes
   */
  public static byUser = scope((query, user?: User) => {
    const roleCodes = getRoleCodes(user)

    if (
      ['administrator', 'doctor'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    return query.where('user_id', user?.id || 0)
  })
}
