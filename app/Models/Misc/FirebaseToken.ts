import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'
import { getRoleCodes } from 'App/Helpers/Index'
import User from '../People/User'

export default class FirebaseToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public app: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

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

    return query.where('user_id', user?.id || 0)
  })
}
