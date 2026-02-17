import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Permission from '../People/Permission'

export default class Entity extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  /**
   * Relationships
   */

  @hasMany(() => Permission)
  public permissions: HasMany<typeof Permission>
}
