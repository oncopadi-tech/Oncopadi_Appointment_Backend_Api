import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import Specialty from './Specialty'
import { getRoleCodes } from 'App/Helpers/Index'

export default class Symptom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public symptoms: string

  @column.dateTime()
  public date: DateTime

  @column()
  public userId: number

  @column()
  public createdBy: number

  @column()
  public specialtyId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  public creator: BelongsTo<typeof User>

  @belongsTo(() => Specialty)
  public specialty: BelongsTo<typeof Specialty>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

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

    return query
      .where('user_id', user?.id || 0)
      .orWhere('created_by', user?.id || 0)
  })
}
