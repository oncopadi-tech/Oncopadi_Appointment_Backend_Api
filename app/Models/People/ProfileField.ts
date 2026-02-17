import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  ManyToMany,
  manyToMany,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Database from '@ioc:Adonis/Lucid/Database'
import User from './User'
import { getRoleCodes } from 'App/Helpers/Index'

export default class ProfileField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public category: string

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */
  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  /**
   * Scopes
   */

  public static byRoles = scope((query, roles: Array<string>) => {
    const rolesQuery = Database.from('roles')
      .whereIn('code', roles)
      .select('roles.id')

    const roleFieldsQuery = Database.from('profile_field_role')
      .whereIn('role_id', rolesQuery)
      .select('profile_field_id')

    return query.whereIn('profile_fields.id', roleFieldsQuery)
  })

  public static byUser = scope((query, user?: User) => {
    const roles = getRoleCodes(user)

    return ProfileField.byRoles(query, roles)
  })
}
