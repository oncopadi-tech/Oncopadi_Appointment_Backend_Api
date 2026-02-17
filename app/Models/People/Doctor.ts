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
import User from './User'
import Hospital from '../Places/Hospital'
import Specialty from '../Medical/Specialty'
import { getRoleCodes } from 'App/Helpers/Index'
import { search } from 'App/Helpers/Model'

export default class Doctor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public folioNumber: string

  @column()
  public bio: string

  @column()
  public bankAccountNumber: string

  @column()
  public bankAccountName: string

  @column()
  public bankName: string

  @column()
  public active: boolean

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @manyToMany(() => Hospital)
  public hospitals: ManyToMany<typeof Hospital>

  @manyToMany(() => Specialty)
  public specialties: ManyToMany<typeof Specialty>

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

    return query.where('user_id', user?.id || 0)
  })

  public static search = search(
    [
      'title',
      'folioNumber',
      'bio',
      'bankAccountNumber',
      'bankAccountName',
      'bankName'
    ],
    Doctor
  )
}
