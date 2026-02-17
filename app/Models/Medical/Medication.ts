import { DateTime } from 'luxon'
import { BaseModel, column, scope } from '@ioc:Adonis/Lucid/Orm'
import User from '../People/User'
import { getRoleCodes } from 'App/Helpers/Index'

export default class Medication extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime()
  public startDate: DateTime

  @column()
  public dosage: string

  @column()
  public reason: string

  @column()
  public prescriber: string

  @column()
  public sideEfects: string

  @column()
  public fileId: number

  @column()
  public medicalConditionId: number

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
      ['administrator', 'doctor'].filter((role) =>
        roleCodes.find((code) => code === role)
      ).length > 0
    )
      return query

    return query.where('user_id', user?.id || 0)
  })
}
