import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany,
  belongsTo,
  BelongsTo,
  scope
} from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Entity from '../Misc/Entity'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public entityId: number

  /**
   * Relationships
   */

  @belongsTo(() => Entity)
  public entity: BelongsTo<typeof Entity>

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  /**
   * Scopes
   */
  public static byRoles = scope((query, roles: Array<string>) => {
    const rolesQuery = Database.from('roles')
      .whereIn('code', roles)
      .select('id')

    const rolePermissionsQuery = Database.from('permission_role')
      .whereIn('role_id', rolesQuery)
      .select('permission_id')

    return query.whereIn('id', rolePermissionsQuery)
  })
}
