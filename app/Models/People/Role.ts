import {
  BaseModel,
  column,
  manyToMany,
  ManyToMany
} from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public active: boolean

  /**
   * Relationships
   */

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>
}
